import { useState } from 'react';
import '../styles/pages/Blog.css';
import blogHeroBg from '../assets/blog_bg.png';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const blogPosts = [
    {
      id: 1,
      title: "Complete Guide to PC Building in 2026",
      excerpt: "Walk through every step: choosing your CPU and motherboard combo, pairing RAM correctly, installing the GPU, and managing cables so airflow isn't choked. We also cover POST troubleshooting for when your first boot doesn't go as expected.",
      category: "Hardware",
      author: "Matt Safford & A. Freedman",
      authorInitial: "M",
      date: "Feb 8, 2026",
      readTime: "8 min",
      tag: "Popular",
      tagColor: "tag-orange",
      externalUrl: "http://tomshardware.com/how-to/build-a-pc",
      featured: true,
    },
    {
      id: 2,
      title: "TESDA CSS NC II: What You Need to Know",
      excerpt: "The Computer Systems Servicing NC II is the most in-demand TESDA certification for aspiring IT technicians in the Philippines. This article breaks down the four core competencies and gives you a realistic study timeline.",
      category: "Certification",
      author: "TESDA",
      authorInitial: "T",
      date: "Feb 5, 2026",
      readTime: "5 min",
      tag: "Must Read",
      tagColor: "tag-red",
      externalUrl: "https://www.tesda.gov.ph/Download?SearchTitle=&Searchcat=Regular+-+Competency+Based+Curriculum",
      featured: false,
    },
    {
      id: 3,
      title: "Common Network Issues and How to Fix Them",
      excerpt: "From intermittent Wi-Fi drops to DNS failures and misconfigured IP settings, network problems are among the most frequent issues technicians face. Covers the top 10 network errors with step-by-step fixes.",
      category: "Networking",
      author: "Tim Brookes",
      authorInitial: "T",
      date: "Feb 3, 2026",
      readTime: "6 min",
      tag: null,
      tagColor: null,
      externalUrl: "https://www.howtogeek.com/721045/internet-not-working-10-tips-to-troubleshoot-a-connection/",
      featured: false,
    },
    {
      id: 4,
      title: "Understanding BIOS Settings: A Beginner's Guide",
      excerpt: "The BIOS is the first software your computer runs. This guide covers the settings that actually matter: enabling XMP for RAM performance, configuring secure boot, setting fan curves, and understanding TPM 2.0.",
      category: "Tutorials",
      author: "How-To Geek Editors",
      authorInitial: "H",
      date: "Jan 30, 2026",
      readTime: "7 min",
      tag: null,
      tagColor: null,
      externalUrl: "https://www.howtogeek.com/your-computer-bios-is-full-of-settings-but-which-should-you-actually-change/",
      featured: false,
    },
    {
      id: 5,
      title: "Windows 11 Installation: Step-by-Step",
      excerpt: "Installing Windows 11 correctly means handling partitioning, driver injection, and activation. This walkthrough covers clean installation via USB, bypassing TPM checks on older hardware, and installing drivers in the right order.",
      category: "Software",
      author: "Microsoft Support",
      authorInitial: "M",
      date: "Jan 28, 2026",
      readTime: "10 min",
      tag: "Featured",
      tagColor: "tag-blue",
      externalUrl: "https://support.microsoft.com/en-us/windows/ways-to-install-windows-11-e0edbbfb-cfc5-4011-868b-2ce77ac7c70e",
      featured: false,
    },
    {
      id: 6,
      title: "Best Practices for Computer Maintenance",
      excerpt: "Preventive maintenance extends the life of every machine in your care. Covers quarterly dust cleaning, thermal paste replacement, HDD health monitoring with CrystalDiskInfo, and how to document your maintenance logs.",
      category: "Maintenance",
      author: "PC Gamer Staff",
      authorInitial: "P",
      date: "Jan 25, 2026",
      readTime: "5 min",
      tag: null,
      tagColor: null,
      externalUrl: "https://www.pcgamer.com/how-to-clean-your-computer-case/",
      featured: false,
    },
    {
      id: 7,
      title: "Cybersecurity Basics Every Technician Must Know",
      excerpt: "As a computer technician, you're often the first line of defense against malware and social engineering attacks. Covers setting up Windows Defender, understanding phishing red flags, and securing remote access tools.",
      category: "Security",
      author: "CISA",
      authorInitial: "C",
      date: "Jan 22, 2026",
      readTime: "9 min",
      tag: "Important",
      tagColor: "tag-amber",
      externalUrl: "https://www.cisa.gov/topics/cybersecurity-best-practices",
      featured: false,
    },
    {
      id: 8,
      title: "Router Configuration 101",
      excerpt: "A misconfigured router is a security risk and a performance bottleneck. This guide covers logging into your admin panel, setting up DHCP reservations, enabling WPA3, configuring port forwarding, and using QoS.",
      category: "Networking",
      author: "PCWorld Staff",
      authorInitial: "P",
      date: "Jan 20, 2026",
      readTime: "8 min",
      tag: null,
      tagColor: null,
      externalUrl: "https://www.pcworld.com/article/474115/how-to-set-up-a-wireless-router.html",
      featured: false,
    },
  ];

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'Hardware', label: 'Hardware' },
    { key: 'Software', label: 'Software' },
    { key: 'Networking', label: 'Networking' },
    { key: 'Security', label: 'Security' },
    { key: 'Certification', label: 'Certification' },
    { key: 'Tutorials', label: 'Tutorials' },
    { key: 'Maintenance', label: 'Maintenance' },
  ];

  const filteredPosts = blogPosts.filter(p => {
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const featuredPost = blogPosts[0];
  const showFeatured = selectedCategory === 'all' && !searchQuery;

  return (
    <div className="bl-page">

      {/* ══ HERO ══ */}
      <section className="bl-hero" style={{ backgroundImage: `url(${blogHeroBg})` }}>
        <div className="bl-hero-noise" />
        <div className="bl-hero-glow" />
        <div className="bl-hero-inner">
          <div className="bl-hero-badge">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            Knowledge Base
          </div>
          <h1 className="bl-hero-title">
            Learn. Build. <span>Master Tech.</span>
          </h1>
          <p className="bl-hero-sub">
            In-depth tutorials and expert guides for TESDA CSS NC II candidates and IT technicians.
          </p>

          {/* Search */}
          <div className="bl-search-wrap">
            <svg className="bl-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className="bl-search"
              type="text"
              placeholder="Search articles…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="bl-hero-meta">
            <span><strong>{blogPosts.length}</strong> Articles</span>
            <span className="bl-dot" />
            <span><strong>7</strong> Topics</span>
            <span className="bl-dot" />
            <span><strong>4</strong> Contributors</span>
          </div>
        </div>
      </section>

      {/* ══ CONTENT ══ */}
      <div className="bl-body">

        {/* ── FEATURED ── */}
        {showFeatured && (
          <section className="bl-featured-wrap">
            <div className="bl-section-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              Featured Article
            </div>
            <a
              href={featuredPost.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bl-featured"
            >
              <div className="bl-featured-left">
                <div className="bl-featured-cat">{featuredPost.category}</div>
                <h2 className="bl-featured-title">{featuredPost.title}</h2>
                <p className="bl-featured-excerpt">{featuredPost.excerpt}</p>
                <div className="bl-featured-footer">
                  <div className="bl-fmeta-author">
                    <div className="bl-ava bl-ava-navy">{featuredPost.authorInitial}</div>
                    <div>
                      <div className="bl-ava-name">{featuredPost.author}</div>
                      <div className="bl-ava-date">{featuredPost.date} · {featuredPost.readTime} read</div>
                    </div>
                  </div>
                  <span className="bl-featured-cta">
                    Read Article
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </span>
                </div>
              </div>
              <div className="bl-featured-right">
                <div className="bl-featured-visual">
                  <div className="bl-fv-card">
                    <div className="bl-fv-bar bl-fv-bar-a" />
                    <div className="bl-fv-bar bl-fv-bar-b" />
                    <div className="bl-fv-bar bl-fv-bar-c" />
                    <div className="bl-fv-chip" />
                  </div>
                  <div className="bl-fv-readtime">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {featuredPost.readTime} read
                  </div>
                </div>
              </div>
            </a>
          </section>
        )}

        {/* ── FILTER TABS ── */}
        <div className="bl-filter-bar">
          <div className="bl-filter-tabs">
            {categories.map(cat => (
              <button
                key={cat.key}
                className={`bl-filter-tab ${selectedCategory === cat.key ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.key)}
              >
                {cat.label}
                {cat.key !== 'all' && (
                  <span className="bl-filter-count">
                    {blogPosts.filter(p => p.category === cat.key).length}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="bl-results-label">
            {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* ── GRID ── */}
        <div className="bl-grid">
          {(showFeatured ? filteredPosts.slice(1) : filteredPosts).map((post, i) => (
            <a
              key={post.id}
              href={post.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bl-card"
              style={{ animationDelay: `${i * 0.055}s` }}
            >
              <div className="bl-card-head">
                <div className="bl-card-meta-row">
                  <span className="bl-card-cat">{post.category}</span>
                  <span className="bl-card-time">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {post.readTime}
                  </span>
                </div>
                {post.tag && (
                  <span className={`bl-tag ${post.tagColor}`}>{post.tag}</span>
                )}
              </div>

              <div className="bl-card-body">
                <h3 className="bl-card-title">{post.title}</h3>
                <p className="bl-card-excerpt">{post.excerpt}</p>
              </div>

              <div className="bl-card-foot">
                <div className="bl-card-author">
                  <div className="bl-ava bl-ava-sm bl-ava-navy">{post.authorInitial}</div>
                  <div>
                    <div className="bl-ava-name">{post.author}</div>
                    <div className="bl-ava-date">{post.date}</div>
                  </div>
                </div>
                <span className="bl-card-read">
                  Read
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </span>
              </div>
            </a>
          ))}

          {filteredPosts.length === 0 && (
            <div className="bl-empty">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <p>No articles found for "<strong>{searchQuery || selectedCategory}</strong>"</p>
            </div>
          )}
        </div>

      </div>

      {/* ══ NEWSLETTER ══ */}
      <section className="bl-newsletter">
        <div className="bl-nl-glow" />
        <div className="bl-nl-inner">
          <div className="bl-nl-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <h2 className="bl-nl-title">Stay in the Loop</h2>
          <p className="bl-nl-sub">New tutorials and tech guides, delivered to your inbox weekly.</p>
          <div className="bl-nl-form">
            <input type="email" placeholder="Enter your email address" className="bl-nl-input" />
            <button className="bl-nl-btn">
              Subscribe
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Blog;