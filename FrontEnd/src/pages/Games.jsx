import { useState, useEffect, useCallback, useRef } from 'react';
import '../styles/pages/Games.css';
import hardwareImg     from '../assets/hardware_assembly.png';
import osImg           from '../assets/os_installation.png';
import networkImg      from '../assets/network_setup.png';
import maintenanceImg  from '../assets/system_maintence.png';
import securityImg     from '../assets/IT_security.png';
import troubleImg      from '../assets/troubleshoting.png';

/* ═══════════════════════════════════════
   QUIZ DATA
═══════════════════════════════════════ */
const QUIZ_DATA = {
  hardware: [
    { id: 'h1', question: 'What does CPU stand for?', options: ['Central Processing Unit', 'Computer Power Unit', 'Core Processing Utility', 'Central Program Unit'], correct: 0, difficulty: 'easy', hint: 'It is the "brain" of the computer.', explanation: 'CPU stands for Central Processing Unit — the primary component that executes instructions.' },
    { id: 'h2', question: 'Which component stores data temporarily while the computer is running?', options: ['HDD', 'SSD', 'RAM', 'ROM'], correct: 2, difficulty: 'easy', hint: 'It is volatile memory — data is lost when powered off.', explanation: 'RAM (Random Access Memory) is volatile temporary storage used by the CPU to run programs.' },
    { id: 'h3', question: 'What is the function of the PSU in a computer?', options: ['Process data', 'Store files', 'Convert AC to DC power', 'Display output'], correct: 2, difficulty: 'easy', hint: 'Think about where the wall outlet power goes.', explanation: 'The PSU (Power Supply Unit) converts alternating current (AC) from the wall to direct current (DC) for components.' },
    { id: 'h4', question: 'Which port is commonly used to connect a monitor to a modern GPU?', options: ['USB-A', 'DisplayPort', 'PS/2', 'Serial'], correct: 1, difficulty: 'medium', hint: 'It replaced DVI for high-resolution displays.', explanation: 'DisplayPort is the modern standard for connecting monitors, supporting high resolutions and refresh rates.' },
    { id: 'h5', question: 'What is the purpose of thermal paste?', options: ['Lubricate fans', 'Improve heat transfer between CPU and cooler', 'Power the CPU', 'Bond the motherboard'], correct: 1, difficulty: 'medium', hint: 'It sits between the processor and its heatsink.', explanation: 'Thermal paste fills microscopic gaps between the CPU and heatsink, improving thermal conductivity.' },
    { id: 'h6', question: 'What form factor is most common for desktop motherboards?', options: ['Mini-ITX', 'Micro-ATX', 'ATX', 'E-ATX'], correct: 2, difficulty: 'medium', hint: 'It is the standard full-size form factor.', explanation: 'ATX (Advanced Technology eXtended) is the most common desktop motherboard form factor.' },
    { id: 'h7', question: 'How many pins does a standard ATX 24-pin connector have?', options: ['20', '24', '28', '32'], correct: 1, difficulty: 'hard', hint: 'Count the pins on a standard main power connector.', explanation: 'The standard ATX main power connector has 24 pins, providing power to the motherboard.' },
    { id: 'h8', question: 'What technology allows RAM modules to work in pairs for better bandwidth?', options: ['Overclocking', 'Dual-channel', 'ECC', 'XMP'], correct: 1, difficulty: 'hard', hint: 'Install matched pairs in the correct slots.', explanation: 'Dual-channel memory doubles the data bus width by using two matched RAM modules simultaneously.' },
    { id: 'h9', question: 'What is the cache in a CPU?', options: ['A type of RAM', 'Ultra-fast on-chip memory', 'A cooling fan', 'A power regulator'], correct: 1, difficulty: 'hard', hint: 'It sits directly on the processor die.', explanation: 'CPU cache is ultra-fast SRAM built into the processor to store frequently accessed data.' },
    { id: 'h10', question: 'Which bus connects the CPU to the RAM?', options: ['PCI bus', 'Front Side Bus / Memory bus', 'SATA bus', 'USB bus'], correct: 1, difficulty: 'hard', hint: 'It is the main data highway between processor and memory.', explanation: 'The memory bus (or FSB on older systems) connects the CPU directly to RAM for data transfer.' },
  ],
  os: [
    { id: 'o1', question: 'What is the first step when installing Windows 11?', options: ['Format C drive', 'Boot from installation media', 'Install drivers', 'Create user account'], correct: 1, difficulty: 'easy', hint: 'You need to start from external media.', explanation: 'Booting from USB or DVD installation media is the first step to begin a Windows installation.' },
    { id: 'o2', question: 'Which file system does Windows 11 require for the system drive?', options: ['FAT32', 'exFAT', 'NTFS', 'ext4'], correct: 2, difficulty: 'easy', hint: 'It supports files larger than 4GB and permissions.', explanation: 'Windows 11 requires NTFS on the system partition as it supports large files, permissions, and journaling.' },
    { id: 'o3', question: 'What does BIOS stand for?', options: ['Basic Input Output System', 'Binary Integrated OS', 'Base Internal Operating Software', 'Boot Initialize Output System'], correct: 0, difficulty: 'easy', hint: 'It is firmware that starts before the OS.', explanation: 'BIOS stands for Basic Input Output System — firmware that initializes hardware before the OS loads.' },
    { id: 'o4', question: 'What replaces BIOS on modern systems?', options: ['CMOS', 'POST', 'UEFI', 'MBR'], correct: 2, difficulty: 'medium', hint: 'It has a graphical interface and supports drives over 2TB.', explanation: 'UEFI (Unified Extensible Firmware Interface) replaces legacy BIOS with more features and GPT disk support.' },
    { id: 'o5', question: 'Which partition style is required for Windows 11?', options: ['MBR', 'GPT', 'FAT', 'NTFS'], correct: 1, difficulty: 'medium', hint: 'It supports drives larger than 2TB.', explanation: 'Windows 11 requires GPT (GUID Partition Table) as it requires UEFI boot.' },
    { id: 'o6', question: 'What is the purpose of device drivers?', options: ['Speed up the CPU', 'Allow OS to communicate with hardware', 'Manage user accounts', 'Encrypt the hard drive'], correct: 1, difficulty: 'medium', hint: 'They act as translators between hardware and software.', explanation: 'Device drivers are software that allows the operating system to communicate with and control hardware devices.' },
    { id: 'o7', question: 'Which Windows tool is used to manage disk partitions?', options: ['Task Manager', 'Disk Management', 'Device Manager', 'Registry Editor'], correct: 1, difficulty: 'medium', hint: 'You can create, delete and format partitions here.', explanation: 'Disk Management (diskmgmt.msc) is the built-in Windows tool for managing disk partitions and volumes.' },
    { id: 'o8', question: 'What does POST stand for in computer booting?', options: ['Power On Self Test', 'Primary OS Start Test', 'Peripheral Output System Transfer', 'Processor Operating Status Test'], correct: 0, difficulty: 'hard', hint: 'It happens the moment you press the power button.', explanation: 'POST (Power On Self Test) is a diagnostic test run by the BIOS/UEFI immediately after powering on.' },
    { id: 'o9', question: 'Which command checks and repairs disk errors in Windows?', options: ['sfc /scannow', 'chkdsk', 'diskpart', 'format'], correct: 1, difficulty: 'hard', hint: 'It stands for "check disk".', explanation: 'CHKDSK (Check Disk) scans and repairs file system errors and bad sectors on a drive.' },
    { id: 'o10', question: 'What is the Windows Registry?', options: ['A list of installed programs', 'A hierarchical database of system and app settings', 'A disk partition', 'A network configuration file'], correct: 1, difficulty: 'hard', hint: 'Access it with regedit.', explanation: 'The Windows Registry is a hierarchical database storing low-level settings for the OS and applications.' },
  ],
  network: [
    { id: 'n1', question: 'What does IP stand for?', options: ['Internet Protocol', 'Internal Port', 'Integrated Pathway', 'Input Processor'], correct: 0, difficulty: 'easy', hint: 'Every device on a network has one of these addresses.', explanation: 'IP stands for Internet Protocol — the set of rules governing how data is sent across networks.' },
    { id: 'n2', question: 'What is the default subnet mask for a Class C network?', options: ['255.0.0.0', '255.255.0.0', '255.255.255.0', '255.255.255.255'], correct: 2, difficulty: 'easy', hint: 'Class C supports up to 254 hosts.', explanation: '255.255.255.0 is the default Class C subnet mask, leaving one octet for host addresses.' },
    { id: 'n3', question: 'What device connects different networks and routes traffic between them?', options: ['Switch', 'Hub', 'Router', 'Bridge'], correct: 2, difficulty: 'easy', hint: 'Your home internet device is one of these.', explanation: 'A router connects multiple networks and determines the best path to forward packets between them.' },
    { id: 'n4', question: 'What protocol automatically assigns IP addresses to devices?', options: ['DNS', 'FTP', 'DHCP', 'HTTP'], correct: 2, difficulty: 'medium', hint: 'Without it you would have to set IPs manually.', explanation: 'DHCP (Dynamic Host Configuration Protocol) automatically assigns IP addresses and network settings to clients.' },
    { id: 'n5', question: 'Which layer of the OSI model handles IP addressing?', options: ['Physical', 'Data Link', 'Network', 'Transport'], correct: 2, difficulty: 'medium', hint: 'It is Layer 3.', explanation: 'The Network layer (Layer 3) handles logical addressing (IP) and routing between different networks.' },
    { id: 'n6', question: 'What is the maximum cable length for Cat5e in a network run?', options: ['50 meters', '100 meters', '150 meters', '200 meters'], correct: 1, difficulty: 'medium', hint: 'This is the standard Ethernet distance limit.', explanation: 'Cat5e (and most Ethernet standards) supports a maximum segment length of 100 meters (328 feet).' },
    { id: 'n7', question: 'What does DNS stand for?', options: ['Dynamic Network System', 'Domain Name System', 'Data Node Service', 'Distributed Network Standard'], correct: 1, difficulty: 'medium', hint: 'It translates website names to IP addresses.', explanation: 'DNS (Domain Name System) translates human-readable domain names into IP addresses.' },
    { id: 'n8', question: 'Which port does HTTPS use by default?', options: ['80', '21', '443', '8080'], correct: 2, difficulty: 'hard', hint: 'HTTP uses 80; the secure version uses a different port.', explanation: 'HTTPS uses port 443 by default, providing encrypted communication over TLS/SSL.' },
    { id: 'n9', question: 'What is the loopback IP address?', options: ['192.168.1.1', '10.0.0.1', '127.0.0.1', '172.16.0.1'], correct: 2, difficulty: 'hard', hint: 'It always refers to the local machine itself.', explanation: '127.0.0.1 is the loopback address — used to test network software on the local machine without a physical connection.' },
    { id: 'n10', question: 'What does NAT stand for?', options: ['Network Address Translation', 'Node Access Table', 'Network Authentication Token', 'New Access Technology'], correct: 0, difficulty: 'hard', hint: 'It allows multiple devices to share one public IP.', explanation: 'NAT (Network Address Translation) maps private IP addresses to a public IP, allowing multiple devices to share internet access.' },
  ],
  maintenance: [
    { id: 'm1', question: 'How often should you clean dust from a desktop PC?', options: ['Every week', 'Every 6-12 months', 'Every 5 years', 'Never'], correct: 1, difficulty: 'easy', hint: 'Regular but not too frequent.', explanation: 'Cleaning every 6-12 months prevents dust buildup that causes overheating and hardware failure.' },
    { id: 'm2', question: 'What tool is safe for removing dust inside a PC?', options: ['Vacuum cleaner', 'Compressed air can', 'Wet cloth', 'Feather duster'], correct: 1, difficulty: 'easy', hint: 'It blows air without touching components.', explanation: 'Compressed air cans safely remove dust without touching or damaging sensitive components.' },
    { id: 'm3', question: 'What should you do before opening a computer case?', options: ['Turn up the volume', 'Ground yourself to discharge static', 'Update the BIOS', 'Run a virus scan'], correct: 1, difficulty: 'easy', hint: 'Static electricity can damage components.', explanation: 'Grounding yourself (using an ESD strap or touching a grounded metal surface) prevents static discharge damage.' },
    { id: 'm4', question: 'What does defragmentation do to a hard drive?', options: ['Deletes files', 'Reorganizes fragmented data for faster access', 'Formats the drive', 'Encrypts the drive'], correct: 1, difficulty: 'medium', hint: 'It reorganizes scattered file pieces.', explanation: 'Defragmentation reorganizes fragmented files on HDDs so the read head can access them sequentially, improving performance.' },
    { id: 'm5', question: 'Which Windows utility shows CPU, memory, and disk usage in real time?', options: ['Control Panel', 'Task Manager', 'Device Manager', 'Event Viewer'], correct: 1, difficulty: 'medium', hint: 'Press Ctrl+Shift+Esc to open it.', explanation: 'Task Manager shows real-time performance data for CPU, memory, disk, and network usage.' },
    { id: 'm6', question: 'What is the purpose of a UPS (Uninterruptible Power Supply)?', options: ['Speed up the network', 'Provide backup power during outages', 'Cool the computer', 'Store backup files'], correct: 1, difficulty: 'medium', hint: 'It keeps the computer running when the power cuts out.', explanation: 'A UPS provides battery backup power so you can save work and shut down safely during power outages.' },
    { id: 'm7', question: 'What does SFC /scannow do in Windows?', options: ['Scans for viruses', 'Scans and repairs corrupted system files', 'Formats the drive', 'Scans the network'], correct: 1, difficulty: 'hard', hint: 'SFC stands for System File Checker.', explanation: 'SFC /scannow scans all protected Windows system files and replaces corrupted files with cached copies.' },
    { id: 'm8', question: 'What temperature range is generally safe for a CPU under load?', options: ['20–40°C', '40–60°C', '60–85°C', '90–100°C'], correct: 2, difficulty: 'hard', hint: 'Too cold is not normal under load; too hot causes throttling.', explanation: 'Most CPUs operate safely between 60–85°C under load; above 90°C risks throttling or damage.' },
    { id: 'm9', question: 'What is the 3-2-1 backup rule?', options: ['3 backups, 2 offsite, 1 cloud', '3 copies, 2 different media types, 1 offsite', '3 drives, 2 RAID, 1 backup', '3 daily, 2 weekly, 1 monthly'], correct: 1, difficulty: 'hard', hint: 'It describes copies, media types, and location.', explanation: 'The 3-2-1 rule: keep 3 copies of data, on 2 different media types, with 1 stored offsite.' },
    { id: 'm10', question: 'What Windows log tool records system errors and warnings?', options: ['Task Manager', 'Event Viewer', 'Resource Monitor', 'Performance Monitor'], correct: 1, difficulty: 'hard', hint: 'You can access it via eventvwr.msc.', explanation: 'Event Viewer records system, application, and security events including errors and warnings for troubleshooting.' },
  ],
  security: [
    { id: 's1', question: 'What does a firewall do?', options: ['Cools the CPU', 'Monitors and filters network traffic', 'Speeds up internet', 'Backs up data'], correct: 1, difficulty: 'easy', hint: 'It acts as a barrier between trusted and untrusted networks.', explanation: 'A firewall monitors and controls incoming and outgoing network traffic based on security rules.' },
    { id: 's2', question: 'What is phishing?', options: ['A type of virus', 'Tricking users into revealing sensitive info', 'A network attack', 'Illegal file sharing'], correct: 1, difficulty: 'easy', hint: 'It often comes as a fake email or website.', explanation: 'Phishing is a social engineering attack where attackers impersonate trusted entities to steal credentials or data.' },
    { id: 's3', question: 'What does HTTPS provide over HTTP?', options: ['Faster speeds', 'Encrypted communication', 'More bandwidth', 'Better graphics'], correct: 1, difficulty: 'easy', hint: 'The S stands for Secure.', explanation: 'HTTPS uses TLS/SSL encryption to protect data transmitted between browser and server.' },
    { id: 's4', question: 'What is two-factor authentication (2FA)?', options: ['Two passwords required', 'Verification using two different factors', 'Two users logged in', 'Dual firewall protection'], correct: 1, difficulty: 'medium', hint: 'Something you know plus something you have.', explanation: '2FA requires two distinct forms of verification — typically a password plus a code sent to your phone.' },
    { id: 's5', question: 'What type of malware encrypts your files and demands payment?', options: ['Spyware', 'Adware', 'Ransomware', 'Trojan'], correct: 2, difficulty: 'medium', hint: 'It holds your data hostage.', explanation: 'Ransomware encrypts victim files and demands a ransom payment in exchange for the decryption key.' },
    { id: 's6', question: 'What is the principle of least privilege?', options: ['Give all users admin rights', 'Give users only the access they need', 'Restrict internet access', 'Limit physical access only'], correct: 1, difficulty: 'medium', hint: 'Users should have the minimum access necessary.', explanation: 'Least privilege means granting users only the permissions required for their role, reducing attack surface.' },
    { id: 's7', question: 'What does SQL injection exploit?', options: ['Weak passwords', 'Unvalidated database queries', 'Open ports', 'Outdated antivirus'], correct: 1, difficulty: 'hard', hint: 'Attackers insert malicious code into input fields.', explanation: 'SQL injection inserts malicious SQL code into input fields to manipulate unvalidated database queries.' },
    { id: 's8', question: 'What is a zero-day vulnerability?', options: ['A bug fixed on release day', 'An unknown flaw with no available patch', 'A virus that activates at midnight', 'A network outage'], correct: 1, difficulty: 'hard', hint: 'Vendors have zero days to fix it before it is exploited.', explanation: 'A zero-day is a software vulnerability unknown to the vendor, with no patch available at the time of exploitation.' },
    { id: 's9', question: 'What does MAC address filtering do?', options: ['Blocks malware', 'Controls network access by hardware address', 'Encrypts traffic', 'Monitors bandwidth'], correct: 1, difficulty: 'hard', hint: 'Every network adapter has a unique hardware address.', explanation: 'MAC filtering allows or denies network access based on a device\'s unique hardware (MAC) address.' },
    { id: 's10', question: 'What is the purpose of salting a password hash?', options: ['Make it readable', 'Add random data to prevent rainbow table attacks', 'Speed up hashing', 'Compress the hash'], correct: 1, difficulty: 'hard', hint: 'It adds random data before hashing.', explanation: 'A salt is random data added to a password before hashing, making precomputed rainbow table attacks ineffective.' },
  ],
  trouble: [
    { id: 't1', question: 'A computer powers on but there is no display. What should you check first?', options: ['Reinstall Windows', 'Check monitor cable and power', 'Replace the CPU', 'Format the drive'], correct: 1, difficulty: 'easy', hint: 'Start with the simplest physical connection.', explanation: 'Always check physical connections first — a loose monitor cable or unplugged power is the most common cause.' },
    { id: 't2', question: 'What does a single beep during POST typically indicate?', options: ['RAM failure', 'GPU failure', 'Successful POST', 'CPU overheating'], correct: 2, difficulty: 'easy', hint: 'It is the normal startup sound.', explanation: 'A single beep during POST on most systems indicates a successful hardware check — everything is OK.' },
    { id: 't3', question: 'A PC is running slowly. What is a quick first step to diagnose it?', options: ['Reinstall the OS', 'Check Task Manager for resource usage', 'Replace the RAM', 'Update the BIOS'], correct: 1, difficulty: 'easy', hint: 'Check what is using the most resources.', explanation: 'Task Manager shows which processes consume the most CPU, RAM, or disk — the fastest diagnostic step.' },
    { id: 't4', question: 'What does the Blue Screen of Death (BSOD) indicate?', options: ['Virus infection', 'A critical system error has occurred', 'Monitor failure', 'Network disconnection'], correct: 1, difficulty: 'medium', hint: 'Windows cannot recover from this error.', explanation: 'BSOD indicates a critical system error that Windows cannot recover from — usually a driver or hardware issue.' },
    { id: 't5', question: 'A user cannot access the internet but others on the same network can. What is the most likely cause?', options: ['ISP outage', 'Router failure', 'Problem with that specific device', 'DNS server down'], correct: 2, difficulty: 'medium', hint: 'Isolate the problem — it is only one device.', explanation: 'If only one device has no internet while others work, the issue is with that device\'s network settings or adapter.' },
    { id: 't6', question: 'What command tests basic network connectivity to another host?', options: ['ipconfig', 'ping', 'tracert', 'netstat'], correct: 1, difficulty: 'medium', hint: 'It sends ICMP echo requests.', explanation: 'PING sends ICMP echo requests to a target host and measures response time to test basic connectivity.' },
    { id: 't7', question: 'What does ipconfig /flushdns do?', options: ['Resets TCP/IP stack', 'Clears the DNS resolver cache', 'Renews IP address', 'Disables DNS'], correct: 1, difficulty: 'hard', hint: 'It clears locally cached DNS entries.', explanation: 'ipconfig /flushdns clears the local DNS resolver cache, forcing fresh DNS lookups for all hostnames.' },
    { id: 't8', question: 'A hard drive makes a clicking sound. What does this most likely mean?', options: ['Normal operation', 'Mechanical failure — back up data immediately', 'Virus activity', 'Driver error'], correct: 1, difficulty: 'hard', hint: 'This sound from a drive is never good news.', explanation: 'Clicking from an HDD indicates mechanical failure (read head or platter issue) — back up data immediately before it fails.' },
    { id: 't9', question: 'What is the first action when a device is suspected of being infected with malware?', options: ['Delete all files', 'Isolate it from the network', 'Reinstall Windows', 'Update antivirus'], correct: 1, difficulty: 'hard', hint: 'Prevent it from spreading first.', explanation: 'Isolating the device from the network prevents the malware from spreading to other systems while you investigate.' },
    { id: 't10', question: 'What does "Event ID 41" in Windows Event Viewer typically indicate?', options: ['Successful login', 'Unexpected shutdown or system crash', 'Driver update', 'Disk error'], correct: 1, difficulty: 'hard', hint: 'The system was not shut down cleanly.', explanation: 'Event ID 41 (Kernel-Power) indicates the system was not shut down cleanly — often caused by a crash or power loss.' },
  ],
};

const ALL_QUESTIONS = Object.values(QUIZ_DATA).flat();

/* shuffle options so the correct answer is not always the same letter */
function shuffleOptions(question) {
  const indices = [0, 1, 2, 3];
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return {
    ...question,
    options: indices.map(i => question.options[i]),
    correct: indices.indexOf(question.correct),
  };
}

function getQuestions(topic, difficulty, count) {
  let pool = topic === 'all' || !topic
    ? [...ALL_QUESTIONS]
    : [...(QUIZ_DATA[topic] || ALL_QUESTIONS)];

  if (difficulty && difficulty !== 'mixed') {
    pool = pool.filter(q => q.difficulty === difficulty);
  }

  // shuffle question order
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // shuffle each question's options so correct answer lands on a random letter
  return pool.slice(0, Math.min(count, pool.length)).map(shuffleOptions);
}

/* ═══════════════════════════════════════
   useQuiz HOOK
═══════════════════════════════════════ */
const QUESTION_TIME = 60;

function useQuiz() {
  const [state, setState] = useState({
    phase: 'setup',      // 'setup' | 'playing' | 'results'
    questions: [],
    currentIndex: 0,
    selectedAnswer: null,
    isAnswered: false,
    showHint: false,
    timeRemaining: QUESTION_TIME,
    score: 0,
    hintsUsed: 0,
    totalTime: 0,
    topic: null,
    difficulty: null,
    streak: 0,       // current consecutive correct answers
    maxStreak: 0,    // best streak this quiz
  });

  const timerRef = useRef(null);

  const clearTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const startTimer = useCallback(() => {
    clearTimer();
    timerRef.current = setInterval(() => {
      setState(prev => {
        if (prev.timeRemaining <= 1) {
          clearTimer();
          // auto-advance on timeout
          return {
            ...prev,
            timeRemaining: 0,
            isAnswered: true,
            totalTime: prev.totalTime + QUESTION_TIME,
          };
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);
  }, []);

  useEffect(() => () => clearTimer(), []);

  const startQuiz = useCallback((topic, difficulty, count = 10) => {
    const questions = getQuestions(topic, difficulty, count);
    setState({
      phase: 'playing',
      questions,
      currentIndex: 0,
      selectedAnswer: null,
      isAnswered: false,
      showHint: false,
      timeRemaining: QUESTION_TIME,
      score: 0,
      hintsUsed: 0,
      totalTime: 0,
      topic,
      difficulty,
      streak: 0,
      maxStreak: 0,
    });
    startTimer();
  }, [startTimer]);

  const selectAnswer = useCallback((index) => {
    clearTimer();
    setState(prev => {
      if (prev.isAnswered) return prev;
      const correct = prev.questions[prev.currentIndex].correct === index;
      const elapsed = QUESTION_TIME - prev.timeRemaining;
      const newStreak = correct ? prev.streak + 1 : 0;
      return {
        ...prev,
        selectedAnswer: index,
        isAnswered: true,
        score: correct ? prev.score + 1 : prev.score,
        totalTime: prev.totalTime + elapsed,
        streak: newStreak,
        maxStreak: Math.max(prev.maxStreak, newStreak),
      };
    });
  }, []);

  const revealHint = useCallback(() => {
    setState(prev => ({ ...prev, showHint: true, hintsUsed: prev.hintsUsed + 1 }));
  }, []);

  const nextQuestion = useCallback(() => {
    setState(prev => {
      const next = prev.currentIndex + 1;
      if (next >= prev.questions.length) {
        return { ...prev, phase: 'results' };
      }
      startTimer();
      return {
        ...prev,
        currentIndex: next,
        selectedAnswer: null,
        isAnswered: false,
        showHint: false,
        timeRemaining: QUESTION_TIME,
      };
    });
  }, [startTimer]);

  const resetQuiz = useCallback(() => {
    clearTimer();
    setState(prev => ({ ...prev, phase: 'setup' }));
  }, []);

  const currentQuestion = state.questions[state.currentIndex] || null;

  return { state, currentQuestion, startQuiz, selectAnswer, revealHint, nextQuestion, resetQuiz };
}

/* ═══════════════════════════════════════
   QUIZ CARD COMPONENT
═══════════════════════════════════════ */
const QuizCard = ({ question, state, onSelectAnswer, onRevealHint, onNext }) => {
  const { currentIndex, questions, timeRemaining, selectedAnswer, isAnswered, showHint, streak } = state;
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const timeWarning = timeRemaining <= 10;
  const diffColors = { easy: '#16a34a', medium: '#d97706', hard: '#dc2626' };

  return (
    <div className="qcard">
      {/* top bar */}
      <div className="qcard-topbar">
        <div className="qcard-meta">
          <span className="qcard-count">Question {currentIndex + 1} of {questions.length}</span>
          <span className="qcard-diff" style={{ background: diffColors[question.difficulty] + '22', color: diffColors[question.difficulty] }}>
            {question.difficulty}
          </span>
          {streak >= 2 && (
            <span className={`qcard-streak ${streak >= 5 ? 'mega' : ''}`}>
              🔥 {streak}x Streak
            </span>
          )}
        </div>
        <div className={`qcard-timer ${timeWarning ? 'warning' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
          </svg>
          {timeRemaining}s
        </div>
      </div>

      {/* progress */}
      <div className="qcard-progress-bar">
        <div className="qcard-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* question */}
      <h3 className="qcard-question">{question.question}</h3>

      {/* hint */}
      {!showHint && !isAnswered && (
        <button className="qcard-hint-btn" onClick={onRevealHint}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
            <path d="M9 18h6"/><path d="M10 22h4"/>
          </svg>
          Show Hint
        </button>
      )}

      {showHint && !isAnswered && (
        <div className="qcard-hint">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
            <path d="M9 18h6"/><path d="M10 22h4"/>
          </svg>
          <p>{question.hint}</p>
        </div>
      )}

      {/* options */}
      <div className="qcard-options">
        {question.options.map((opt, i) => {
          const isSelected = selectedAnswer === i;
          const isCorrect  = i === question.correct;
          let cls = 'qopt';
          if (isAnswered) {
            if (isCorrect)              cls += ' correct';
            else if (isSelected)        cls += ' wrong';
            else                        cls += ' dimmed';
          } else if (isSelected)        cls += ' selected';

          return (
            <button key={i} className={cls} onClick={() => !isAnswered && onSelectAnswer(i)} disabled={isAnswered}>
              <span className="qopt-letter">
                {isAnswered && isCorrect ? '✓' : isAnswered && isSelected && !isCorrect ? '✗' : String.fromCharCode(65 + i)}
              </span>
              <span className="qopt-text">{opt}</span>
            </button>
          );
        })}
      </div>

      {/* explanation */}
      {isAnswered && (
        <div className="qcard-explanation">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
          </svg>
          <div>
            <p className="qcard-explanation-label">Explanation</p>
            <p className="qcard-explanation-text">{question.explanation}</p>
          </div>
        </div>
      )}

      {/* next */}
      {isAnswered && (
        <div className="qcard-next-wrapper">
          <button className="start-quiz-btn qcard-next-btn" onClick={onNext}>
            {currentIndex + 1 === questions.length ? 'See Results' : 'Next Question'}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════
   QUIZ RESULTS COMPONENT
═══════════════════════════════════════ */
const getGrade = (pct) => {
  if (pct >= 90) return { grade: 'A+', msg: 'Outstanding!',     color: '#16a34a' };
  if (pct >= 80) return { grade: 'A',  msg: 'Excellent!',       color: '#16a34a' };
  if (pct >= 70) return { grade: 'B',  msg: 'Great Job!',       color: '#1e2340' };
  if (pct >= 60) return { grade: 'C',  msg: 'Good Effort!',     color: '#d97706' };
  if (pct >= 50) return { grade: 'D',  msg: 'Keep Practicing!', color: '#d97706' };
  return           { grade: 'F',  msg: 'Try Again!',        color: '#dc2626' };
};

/* ── Confetti — pure JS, no React render path ── */
function launchConfetti() {
  const existing = document.getElementById('confetti-root');
  if (existing) existing.remove();

  const colors = ['#ff7a18','#1e2340','#6366f1','#16a34a','#d97706','#ec4899','#06b6d4'];
  const root = document.createElement('div');
  root.id = 'confetti-root';
  root.setAttribute('aria-hidden', 'true');
  root.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;';

  for (let i = 0; i < 80; i++) {
    const el = document.createElement('div');
    const size = 6 + Math.random() * 8;
    el.className = 'confetti-piece';
    el.style.cssText = [
      `left:${Math.random() * 100}%`,
      `width:${size}px`,
      `height:${size * 0.5}px`,
      `background:${colors[Math.floor(Math.random() * colors.length)]}`,
      `animation-delay:${(Math.random() * 1.2).toFixed(2)}s`,
      `animation-duration:${(1.8 + Math.random() * 1.2).toFixed(2)}s`,
      `--drift:${((Math.random() - 0.5) * 120).toFixed(1)}px`,
      `--rotate:${Math.floor(Math.random() * 360)}deg`,
    ].join(';');
    root.appendChild(el);
  }

  document.body.appendChild(root);
  setTimeout(() => root.remove(), 4000);
}

const QuizResults = ({ state, onPlayAgain, onSaveScore }) => {
  const [name, setName] = useState('');
  const [saved, setSaved] = useState(false);
  const ringRef  = useRef(null);   // SVG circle DOM ref
  const labelRef = useRef(null);   // pct label DOM ref
  const { score, questions, totalTime, hintsUsed, topic, difficulty, maxStreak } = state;
  const pct = Math.round((score / questions.length) * 100);
  const isPerfect = pct === 100;
  const { grade, msg, color } = getGrade(pct);
  const avgTime = Math.round(totalTime / questions.length);
  const circumference = 2 * Math.PI * 42;

  /* count-up animation — pure DOM, no setState in render path */
  useEffect(() => {
    const ring  = ringRef.current;
    const label = labelRef.current;
    if (!ring || !label) return;

    // reset
    ring.style.strokeDashoffset = String(circumference);
    label.textContent = '0%';
    if (pct === 0) return;

    let current = 0;
    const step = Math.ceil(pct / 40);
    const id = setInterval(() => {
      current = Math.min(current + step, pct);
      const offset = circumference * (1 - current / 100);
      ring.style.strokeDashoffset = String(offset);
      label.textContent = current + '%';
      if (current >= pct) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [pct, circumference]);

  /* launch confetti — pure JS, outside render */
  useEffect(() => {
    if (isPerfect) launchConfetti();
  }, [isPerfect]);

  const handleSave = () => {
    if (!name.trim()) return;
    const entry = {
      id: Date.now(),
      name: name.trim(),
      score,
      total: questions.length,
      pct,
      time: totalTime,
      hints: hintsUsed,
      topic: topic || 'all',
      difficulty: difficulty || 'mixed',
      date: new Date(),
    };
    onSaveScore(entry);
    setSaved(true);
  };

  return (
    <div className="qresults">
      <div className="qresults-trophy">{isPerfect ? '🎉' : '🏆'}</div>
      <div className="qresults-grade" style={{ color }}>{grade}</div>
      <h3 className="qresults-msg">{msg}</h3>
      <p className="qresults-sub">You answered <strong>{score}</strong> out of <strong>{questions.length}</strong> correctly</p>

      {/* animated accuracy ring — driven by DOM refs, not setState */}
      <div className="qresults-ring-wrapper">
        <svg className="qresults-ring" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" className="qresults-ring-bg" />
          <circle
            ref={ringRef}
            cx="50" cy="50" r="42"
            className="qresults-ring-fill"
            style={{ strokeDasharray: circumference, strokeDashoffset: circumference, stroke: color }}
          />
        </svg>
        <div className="qresults-ring-label">
          <span ref={labelRef} className="qresults-ring-pct" style={{ color }}>0%</span>
          <span className="qresults-ring-sub">Accuracy</span>
        </div>
      </div>

      <div className="qresults-stats">
        <div className="qresults-stat">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
          </svg>
          <span className="qresults-stat-val">{avgTime}s</span>
          <span className="qresults-stat-lbl">Avg Time</span>
        </div>
        <div className="qresults-stat">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
            <path d="M9 18h6"/><path d="M10 22h4"/>
          </svg>
          <span className="qresults-stat-val">{hintsUsed}</span>
          <span className="qresults-stat-lbl">Hints Used</span>
        </div>
        <div className="qresults-stat">
          <span style={{ fontSize: 20 }}>🔥</span>
          <span className="qresults-stat-val">{maxStreak}</span>
          <span className="qresults-stat-lbl">Best Streak</span>
        </div>
      </div>

      {!saved ? (
        <div className="qresults-save">
          <p className="qresults-save-label">Save your score to the leaderboard</p>
          <div className="qresults-save-row">
            <input
              className="qresults-input"
              placeholder="Enter your name"
              value={name}
              maxLength={20}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
            />
            <button className="start-quiz-btn qresults-save-btn" onClick={handleSave} disabled={!name.trim()}>
              Save
            </button>
          </div>
        </div>
      ) : (
        <p className="qresults-saved">✓ Score saved to leaderboard!</p>
      )}

      <button className="start-quiz-btn" onClick={onPlayAgain}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
        </svg>
        Play Again
      </button>
    </div>
  );
};

/* ═══════════════════════════════════════
   MATCHING CARD GAME
═══════════════════════════════════════ */
const ALL_PAIRS = [
  { id: 'cpu',   term: 'CPU',          def: 'Central Processing Unit — brain of the computer' },
  { id: 'ram',   term: 'RAM',          def: 'Temporary memory for running programs' },
  { id: 'bios',  term: 'BIOS',         def: 'Firmware that initializes hardware on startup' },
  { id: 'gpu',   term: 'GPU',          def: 'Handles graphics and visual rendering' },
  { id: 'hdd',   term: 'HDD',          def: 'Magnetic disk for long-term data storage' },
  { id: 'psu',   term: 'PSU',          def: 'Converts AC power to DC for components' },
  { id: 'nic',   term: 'NIC',          def: 'Network Interface Card for connectivity' },
  { id: 'mobo',  term: 'Motherboard',  def: 'Main circuit board connecting all components' },
  { id: 'ssd',   term: 'SSD',          def: 'Solid State Drive — faster flash storage' },
  { id: 'os',    term: 'OS',           def: 'Operating System — manages hardware and software' },
  { id: 'ip',    term: 'IP Address',   def: 'Unique numerical label for a network device' },
  { id: 'dns',   term: 'DNS',          def: 'Translates domain names to IP addresses' },
];

const LEVEL_PAIRS = (level) => Math.min(level * 3, ALL_PAIRS.length);

function shuffleArr(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(pairs) {
  const cards = [];
  pairs.forEach(p => {
    cards.push({ uid: `${p.id}-term`, pairId: p.id, type: 'term', text: p.term });
    cards.push({ uid: `${p.id}-def`,  pairId: p.id, type: 'def',  text: p.def  });
  });
  return shuffleArr(cards);
}

const MatchingGame = () => {
  const [level,   setLevel]   = useState(1);
  const [deck,    setDeck]    = useState(() => buildDeck(ALL_PAIRS.slice(0, LEVEL_PAIRS(1))));
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves,   setMoves]   = useState(0);
  const [wrong,   setWrong]   = useState([]);
  const [time,    setTime]    = useState(0);
  const [running, setRunning] = useState(false);
  const [levelUp, setLevelUp] = useState(false);

  const pairsThisLevel = LEVEL_PAIRS(level);
  const levelComplete  = matched.length === pairsThisLevel && pairsThisLevel > 0;
  const isMaxLevel     = pairsThisLevel >= ALL_PAIRS.length;

  useEffect(() => {
    if (!running || levelComplete) return;
    const id = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [running, levelComplete]);

  const handleFlip = useCallback((uid) => {
    if (!running) setRunning(true);
    if (wrong.length) return;
    if (flipped.includes(uid)) return;
    if (flipped.length === 2) return;
    const card = deck.find(c => c.uid === uid);
    if (matched.includes(card.pairId)) return;
    const next = [...flipped, uid];
    setFlipped(next);
    if (next.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = next.map(u => deck.find(c => c.uid === u));
      if (a.pairId === b.pairId && a.type !== b.type) {
        setMatched(m => [...m, a.pairId]);
        setFlipped([]);
      } else {
        setWrong(next);
        setTimeout(() => { setFlipped([]); setWrong([]); }, 900);
      }
    }
  }, [deck, flipped, matched, wrong, running, setRunning, setMoves, setMatched, setWrong, setFlipped]);

  const goNextLevel = () => {
    const next = level + 1;
    setLevelUp(true);
    setTimeout(() => setLevelUp(false), 600);
    setLevel(next);
    setDeck(buildDeck(ALL_PAIRS.slice(0, LEVEL_PAIRS(next))));
    setFlipped([]); setMatched([]); setMoves(0); setWrong([]); setTime(0); setRunning(false);
  };

  const restartAll = () => {
    setLevel(1);
    setDeck(buildDeck(ALL_PAIRS.slice(0, LEVEL_PAIRS(1))));
    setFlipped([]); setMatched([]); setMoves(0); setWrong([]); setTime(0); setRunning(false); setLevelUp(false);
  };

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  const gridCols = 3; // 3 cards per row — each level has pairs × 2 cards divisible by 3

  return (
    <div className="match-wrapper">
      <div className="match-header">
        <div className="match-mode-pill">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
          </svg>
          Memory Match
        </div>
        <h2 className="quiz-title">Match the <span className="quiz-title-accent">Terms</span></h2>
        <p className="quiz-subtitle">Match each IT term with its correct definition. Complete all pairs to advance!</p>
      </div>

      <div className={`match-level-bar ${levelUp ? 'level-up-flash' : ''}`}>
        <div className="match-level-info">
          <span className="match-level-badge">Level {level}</span>
          <span className="match-level-desc">{pairsThisLevel} pairs to match</span>
        </div>
        <div className="match-level-dots">
          {Array.from({ length: Math.min(level + 2, 6) }).map((_, i) => (
            <span key={i} className={`match-level-dot ${i < level - 1 ? 'done' : i === level - 1 ? 'active' : ''}`} />
          ))}
        </div>
      </div>

      <div className="match-stats">
        <div className="match-stat">
          <span className="match-stat-val">{matched.length}<span className="match-stat-max">/{pairsThisLevel}</span></span>
          <span className="match-stat-lbl">Matched</span>
        </div>
        <div className="match-stat">
          <span className="match-stat-val">{moves}</span>
          <span className="match-stat-lbl">Moves</span>
        </div>
        <div className="match-stat">
          <span className="match-stat-val">{fmt(time)}</span>
          <span className="match-stat-lbl">Time</span>
        </div>
        <button className="match-restart-btn" onClick={restartAll}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
          </svg>
          Restart
        </button>
      </div>

      <div className="match-progress-bar">
        <div className="match-progress-fill" style={{ width: `${(matched.length / pairsThisLevel) * 100}%` }} />
      </div>

      {!levelComplete ? (
        <div className="match-grid" style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}>
          {deck.map(card => {
            const isFaceUp  = flipped.includes(card.uid) || matched.includes(card.pairId);
            const isMatched = matched.includes(card.pairId);
            const isWrong   = wrong.includes(card.uid);
            return (
              <div
                key={card.uid}
                className={`match-card ${isFaceUp ? 'flipped' : ''} ${isMatched ? 'matched' : ''} ${isWrong ? 'wrong' : ''}`}
                onClick={() => !isFaceUp && handleFlip(card.uid)}
              >
                <div className="match-card-inner">
                  <div className="match-card-back"><span className="match-card-back-icon">⟨/⟩</span></div>
                  <div className={`match-card-front ${card.type}`}>
                    <span className="match-card-type-badge">{card.type === 'term' ? 'TERM' : 'DEF'}</span>
                    <p className="match-card-text">{card.text}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="match-win">
          {isMaxLevel ? (
            <>
              <div className="match-win-emoji">🏆</div>
              <h3 className="match-win-title">You beat all levels!</h3>
              <p className="match-win-sub">Completed in <strong>{moves} moves</strong> and <strong>{fmt(time)}</strong></p>
              <div className="match-win-score">Final Score: <span>{Math.max(0, 1000 * level - (moves * 10) - time)} pts</span></div>
              <button className="start-quiz-btn" onClick={restartAll}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
                </svg>
                Play Again
              </button>
            </>
          ) : (
            <>
              <div className="match-win-emoji">⭐</div>
              <h3 className="match-win-title">Level {level} Complete!</h3>
              <p className="match-win-sub"><strong>{moves} moves</strong> · <strong>{fmt(time)}</strong> · Next: <strong>{LEVEL_PAIRS(level + 1)} pairs</strong></p>
              <div className="match-win-score">Level Score: <span>{Math.max(0, 500 - (moves * 5) - time)} pts</span></div>
              <button className="start-quiz-btn" onClick={goNextLevel}>
                Next Level
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════
   LEADERBOARD COMPONENT
═══════════════════════════════════════ */
const LeaderboardView = ({ leaderboard, onClear }) => {
  const medals = ['🥇', '🥈', '🥉'];
  const fmt = s => s < 60 ? `${s}s` : `${Math.floor(s/60)}m ${s%60}s`;
  const topicLabel = { all: 'All Topics', hardware: 'Hardware', os: 'OS Install', network: 'Network', maintenance: 'Maintenance', security: 'Security', trouble: 'Troubleshooting' };

  if (leaderboard.length === 0) {
    return (
      <div className="lb-empty">
        <div className="lb-empty-icon">🏆</div>
        <h3>No Scores Yet</h3>
        <p>Complete a quiz to appear on the leaderboard!</p>
      </div>
    );
  }

  return (
    <div className="lb-card">
      <div className="lb-card-header">
        <div className="lb-card-title">
          <span className="lb-card-icon">🏆</span>
          <div>
            <h3>Leaderboard</h3>
            <p>{leaderboard.length} player{leaderboard.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button className="lb-clear-btn" onClick={onClear} title="Clear leaderboard">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </div>

      {/* top 3 podium */}
      {leaderboard.length >= 1 && (
        <div className="lb-podium">
          {[leaderboard[1], leaderboard[0], leaderboard[2]].map((entry, idx) => {
            if (!entry) return <div key={idx} />;
            const realRank = idx === 0 ? 1 : idx === 1 ? 0 : 2;
            return (
              <div key={entry.id} className={`lb-podium-slot rank-${realRank}`}>
                <div className="lb-podium-medal">{medals[realRank]}</div>
                <div className="lb-podium-name">{entry.name}</div>
                <div className="lb-podium-score">{entry.score}/{entry.total}</div>
                <div className="lb-podium-time">{fmt(entry.time)}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* rest of list */}
      {leaderboard.slice(3).map((entry, idx) => (
        <div key={entry.id} className="lb-row">
          <span className="lb-row-rank">#{idx + 4}</span>
          <div className="lb-row-info">
            <span className="lb-row-name">{entry.name}</span>
            <span className="lb-row-meta">{topicLabel[entry.topic] || entry.topic} · {entry.difficulty}</span>
          </div>
          <div className="lb-row-right">
            <span className="lb-row-score">{entry.score}/{entry.total}</span>
            <span className="lb-row-time">{fmt(entry.time)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════
   MAIN GAMES PAGE
═══════════════════════════════════════ */
const Games = () => {
  const [activeTab,          setActiveTab]          = useState('play');
  const [selectedTopic,      setSelectedTopic]      = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('mixed');
  const [leaderboard,        setLeaderboard]        = useState([]);
  const [carouselIndex,      setCarouselIndex]      = useState(0);
  const [slideDir,           setSlideDir]           = useState(null); // 'left' | 'right'

  const { state, currentQuestion, startQuiz, selectAnswer, revealHint, nextQuestion, resetQuiz } = useQuiz();

  const topics = [
    { id: 'all',         label: 'All Topics',        sub: 'Mixed questions', icon: '🎯',  img: null },
    { id: 'hardware',    label: 'Hardware Assembly',  sub: '10 questions',   icon: null,  img: hardwareImg },
    { id: 'os',          label: 'OS Installation',    sub: '10 questions',   icon: null,  img: osImg },
    { id: 'network',     label: 'Network Setup',      sub: '10 questions',   icon: null,  img: networkImg },
    { id: 'maintenance', label: 'System Maintenance', sub: '10 questions',   icon: null,  img: maintenanceImg },
    { id: 'security',    label: 'IT Security',        sub: '10 questions',   icon: null,  img: securityImg },
    { id: 'trouble',     label: 'Troubleshooting',    sub: '10 questions',   icon: null,  img: troubleImg },
  ];

  const difficulties = [
    { id: 'mixed',  label: 'Mixed',  emoji: '🎲' },
    { id: 'easy',   label: 'Easy',   emoji: '🌱' },
    { id: 'medium', label: 'Medium', emoji: '⚡' },
    { id: 'hard',   label: 'Hard',   emoji: '🔥' },
  ];

  const handleStartQuiz = () => {
    startQuiz(selectedTopic === 'all' ? null : selectedTopic, selectedDifficulty === 'mixed' ? null : selectedDifficulty, 10);
  };

  const goCarousel = (dir) => {
    setSlideDir(dir);
    const next = dir === 'right'
      ? (carouselIndex + 1) % topics.length
      : (carouselIndex - 1 + topics.length) % topics.length;
    setCarouselIndex(next);
    setSelectedTopic(topics[next].id);
    setTimeout(() => setSlideDir(null), 350);
  };

  return (
    <div className="games-page">

      {/* Hero */}
      <div className="games-hero">
        <div className="games-hero-content">
          <div className="games-hero-badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2"/><path d="m8 21 4-4 4 4"/><path d="M7 17H5"/><path d="M19 17h-2"/>
            </svg>
            Interactive Learning
          </div>
          <h1 className="games-hero-title">Test Your <span className="games-hero-accent">Knowledge</span></h1>
          <p className="games-hero-subtitle">
            Challenge yourself with topic-based quizzes, compete on the leaderboard, and
            track your progress as you master Computer Systems Servicing.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="games-tabs-wrapper">
        <div className="games-tabs">
          <button className={`games-tab ${activeTab === 'play' ? 'active' : ''}`} onClick={() => { setActiveTab('play'); resetQuiz(); }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2"/><path d="m8 21 4-4 4 4"/>
            </svg>
            Play Quiz
          </button>
          <button className={`games-tab ${activeTab === 'match' ? 'active' : ''}`} onClick={() => setActiveTab('match')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
            </svg>
            Memory Match
          </button>
          <button className={`games-tab ${activeTab === 'leaderboard' ? 'active' : ''}`} onClick={() => setActiveTab('leaderboard')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
            </svg>
            Leaderboard
          </button>
        </div>
      </div>

      {/* ── Play Quiz Tab ── */}
      {activeTab === 'play' && (
        <div className="games-container">

          {/* SETUP phase */}
          {state.phase === 'setup' && (
            <>
              <div className="quiz-mode-pill-wrapper">
                <div className="quiz-mode-pill">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                  Quiz Mode
                </div>
              </div>
              <div className="quiz-header">
                <h2 className="quiz-title">Choose Your <span className="quiz-title-accent">Challenge</span></h2>
                <p className="quiz-subtitle">Select a topic and difficulty level to test your knowledge. Compete for a spot on the leaderboard!</p>
              </div>
              <div className="quiz-section">
                <h3 className="quiz-section-label">Select Topic</h3>

                {/* ── TOPIC CAROUSEL ── */}
                {(() => {
                  const t = topics[carouselIndex];
                  const topicDesc = {
                    all: 'Test yourself across all topics — hardware, networking, OS, security, and more. A randomized mix of questions keeps every round fresh and unpredictable.',
                    hardware: 'Dive into the physical world of computing. From CPUs to PSUs, learn how to identify, assemble, and troubleshoot the core components of a desktop system.',
                    os: 'Master the installation and configuration of operating systems. Covers BIOS/UEFI, disk partitioning, drivers, and Windows setup step-by-step.',
                    network: 'Understand IP addressing, routing protocols, DNS, DHCP, and how devices talk to each other across a local network and the internet.',
                    maintenance: 'Keep systems running at peak performance. Learn cleaning techniques, preventive maintenance, diagnostics, and performance tuning.',
                    security: 'Protect systems from threats. Covers malware types, encryption, firewalls, password policies, and best practices in cybersecurity.',
                    trouble: 'Diagnose and solve common hardware and software issues. Practice systematic troubleshooting across boot failures, network problems, and more.',
                  };
                  return (
                    <div className="carousel-wrapper">
                      {/* Left Arrow */}
                      <button className="carousel-arrow carousel-arrow-left" onClick={() => goCarousel('left')} aria-label="Previous topic">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 18l-6-6 6-6"/>
                        </svg>
                      </button>

                      {/* Card */}
                      <div className={`carousel-card ${slideDir ? `slide-${slideDir}` : ''}`}>
                        <div className="carousel-img-wrap">
                          {t.img
                            ? <img src={t.img} alt={t.label} className="carousel-img" />
                            : <div className="carousel-img-placeholder">🎯</div>
                          }
                          <div className="carousel-img-overlay" />
                        </div>
                        <div className="carousel-info">
                          <div className="topic-detail-badge">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                            10 Questions
                          </div>
                          <h2 className="topic-detail-title">{t.label}</h2>
                          <p className="topic-detail-desc">{topicDesc[t.id]}</p>

                          {/* Dot indicators */}
                          <div className="carousel-dots">
                            {topics.map((_, i) => (
                              <button
                                key={i}
                                className={`carousel-dot ${i === carouselIndex ? 'active' : ''}`}
                                onClick={() => { setSlideDir(i > carouselIndex ? 'right' : 'left'); setCarouselIndex(i); setSelectedTopic(topics[i].id); setTimeout(() => setSlideDir(null), 350); }}
                                aria-label={`Topic ${i + 1}`}
                              />
                            ))}
                          </div>

                          <div className="topic-detail-difficulty-label">Select Difficulty</div>
                          <div className="topic-detail-difficulty-row">
                            {difficulties.map(d => (
                              <button key={d.id} className={`topic-detail-diff-btn ${selectedDifficulty === d.id ? 'active' : ''}`} onClick={() => setSelectedDifficulty(d.id)}>
                                <span>{d.emoji}</span><span>{d.label}</span>
                              </button>
                            ))}
                          </div>
                          <div className="topic-detail-actions">
                            <button className="topic-detail-start-btn" onClick={handleStartQuiz}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                              Start Quiz
                            </button>
                            <span className="topic-detail-meta">Timed • Hints available</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Arrow */}
                      <button className="carousel-arrow carousel-arrow-right" onClick={() => goCarousel('right')} aria-label="Next topic">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 18l6-6-6-6"/>
                        </svg>
                      </button>
                    </div>
                  );
                })()}
              </div>
            </>
          )}

          {/* PLAYING phase */}
          {state.phase === 'playing' && currentQuestion && (
            <QuizCard
              question={currentQuestion}
              state={state}
              onSelectAnswer={selectAnswer}
              onRevealHint={revealHint}
              onNext={nextQuestion}
            />
          )}

          {/* RESULTS phase */}
          {state.phase === 'results' && (
            <QuizResults
              state={state}
              onPlayAgain={resetQuiz}
              onSaveScore={entry => setLeaderboard(prev => [...prev, entry].sort((a, b) => b.pct - a.pct || a.time - b.time).slice(0, 20))}
            />
          )}
        </div>
      )}

      {/* ── Memory Match Tab ── */}
      {activeTab === 'match' && (
        <div className="games-container match-container">
          <MatchingGame />
        </div>
      )}

      {/* ── Leaderboard Tab ── */}
      {activeTab === 'leaderboard' && (
        <div className="games-container leaderboard-container">
          <LeaderboardView leaderboard={leaderboard} onClear={() => setLeaderboard([])} />
        </div>
      )}

    </div>
  );
};

export default Games;