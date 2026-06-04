import express from "express";

const router = express.Router();

// 1. Defined Data Array
const users = [{ name: "Alice" }, { name: "Bob" }, { name: "Charlie" }];

// 2. Defined Middleware Functions (Clean & clear for Express to see)
function logger(req, res, next) {
    console.log(req.originalUrl);
    next();
}

// 3. Apply your logger safely 
router.use(logger); 

// 4. URL Param Interceptor Middleware
router.param("id", (req, res, next, id) => {
    req.user = users[id];
    next();
});

// --- ROUTES ---

router.get("/", (req, res) => {   
    console.log(req.query.name);
    res.send("User List");
});

router.get("/new", (req, res) => {
    res.render("users/new", { firstName: "Test" });
});

router.post("/", (req, res) => {
    const isValid = false;
    if (isValid) {
        users.push({ firstName: req.body.firstName });
        res.redirect(`/users/${users.length - 1}`);
    } else {
        console.log("Error");
        res.render(`users/new`, { firstName: req.body.firstName });
    }
});

router
    .route("/:id")
    .get((req, res) => {
        console.log(req.user);
        res.send(`Get User With ID ${req.params.id}`);
    })
    .put((req, res) => {
        res.send(`Update User With ID ${req.params.id}`);
    })
    .delete((req, res) => {
        res.send(`Delete User With ID ${req.params.id}`);
    });

// Export using modern ESM syntax
export default router;