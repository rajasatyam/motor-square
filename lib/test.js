// db.products.aggregate([{

//     $group:{
//         _id:"$company",
//         totalProducts:{$sum:1},
//     }
// }
    
// ])

// db.products.aggregate([{
//     $match:{
//         company:'64c23350e32f4a51b19b9247'
//     }
// }
// ])

// db.products.aggregate([
//     {
//         $match:{'price':{$gt: 1200}}

//     },
//     {
//     $group:{
//         _id:"$company",
//         totalProducts:{$sum:'$price'},
//     }
// } 
// ])

// db.sales.aggregate([
//     {
//       $match:{'quantity':{$eq:5}}
//     },
//    {
//       $group:{
//         _id:'$quantity',
//         priceTotal:{$sum:'$price'},
//         priceAvg:{$avg:'$price'}
//       }
//     }
// ])

// db.products.aggregate([
//     {
//         $match:{'price':{$gt: 1200}}

//     },
//     {
//     $group:{
//         _id:"$company",
//         totalPrice:{$sum:'$price'},
//     }
// },
// {
//   $sort:{'totalPrice':-1}
// }
// ])
