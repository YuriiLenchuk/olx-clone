// const { Customer } = require('../models/user_model');
//
// const getUsers = async (req, res) => {
//     res.status(200).json(await Customer.find(undefined, undefined, undefined));
// };
//
// const addUser = async (req, res) => {
//     const body = req.body;
//     try {
//         if (Array.isArray(body)) {
//             const newCustomers = await Customer.insertMany(body);
//             res.status(201).json(newCustomers);
//         } else {
//             const customer = new Customer(body);
//             const newCustomer = await customer.save();
//             res.status(201).json(newCustomer);
//         }
//     } catch (error) {
//         if (error.code === 11000) {
//             res.status(400).json('CustomerID must be unique');
//         } else {
//             res.status(400).json({ message: error.message });
//         }
//     }
// };
//
// const deleteUser = async (req, res) => {
//     try {
//         const { id } = req.params;
//         if (!id) res.status(404).send('Not Found');
//
//         res.status(201).json(await Customer.findOneAndDelete({ CustomerID: id }));
//     } catch (error) {
//         console.error(error);
//         res.status(500).json('Internal Server Error');
//     }
// };
//
// const getDeleteLog = async (req, res) => {
//     try {
//         res.status(200).json(await DeleteLog.find());
//     } catch (error) {
//         res.status(500).json({ message: error });
//     }
// };
//
// module.exports = {
//     getUsers,
//     addUser,
//     deleteUser,
//     getDeleteLog,
// };
