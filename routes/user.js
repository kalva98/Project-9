const express = require('express');
const router = express.Router();
//const User = require('../models/User');

//const authenticateUser = (req, res, next) => {}

router.get('/users', async (req, res) => {
    try {
        const user = await Users.findByPk(req.params.id);
        //await is not to move or do nothing until it gets the Users.findbyPK
        res.json(user);
    
        //rendering the template, brings the books and title to the page
    } catch (err) {
        res.sendStatus(200);
    }
});

router.post('/user', async (req, res, next) => {
    try {
        const user = await Users.create(req.body)
         res.redirect('/');
//     } catch (err) {
//         if (err.name === "SequelizeValidationError") {
//             res.render('books/new-book', {
//                 book: Books.build(req.body),
//                 title: "New Book",
//                 errors: err.errors
//             });

//         } else {
//             res.render('error', err);
//         }
//     }
// });


// GET /books/new - Shows the create book form
// router.get('/users', (req, res) =>
//     res.render('user'), {
//         book: Books.build(),
//         title: "New Book"
//     })
// );

// //simplified
// //POST Creates a book
// router.post('/new', async (req, res, next) => {
//     try {
//         await Books.create(req.body)
//         res.redirect('/');
//     } catch (err) {
//         if (err.name === "SequelizeValidationError") {
//             res.render('books/new-book', {
//                 book: Books.build(req.body),
//                 title: "New Book",
//                 errors: err.errors
//             });

//         } else {
//             res.render('error', err);
//         }
//     }
// });

// //simplified
// router.get('/:id/update', async (req, res, next) => {
//     try {
//         const book = await Books.findByPk(req.params.id)
//         res.render('books/update-book', {
//             book: book,
//             title: 'Edit Book'
//         });

//     } catch (err) {
//         res.render('error', err);
//     }
// });

// //POST /books/:id/delete - Deletes book from database.
// router.post('/:id/delete', function (req, res, next) {
//     Books.findByPk(req.params.id)
//         .then(function (book) {
//             if (book) {
//                 return book.destroy();
//             } else {
//                 res.render('books/page-not-found');
//             }
//         }).then(() => {
//             res.redirect("/books");
//         }).catch(function (err) {
//             res.render('error', err);
//         });
// });

// // //POST /books/:id/update - Updates book info in the database.
// router.post('/:id/update', function (req, res, next) {
//     Books.findByPk(req.params.id)
//         .then(function (book) {
//             if (book) {
//                 return book.update(req.body);
//             }
//         }).then(function (article) {
//             res.redirect("/");
//         }).catch(function (err) {
//             if (err.name === "SequelizeValidationError") {
//                 let book = Books.build(req.body);
//                 res.render("books/update-book", {
//                     book: book,
//                     errors: err.errors
//                 });
//             } else {
//                 throw err;
//             }
//         }).catch(function (err) {
//             res.render('error', err)
//         });
// });

module.exports = router;