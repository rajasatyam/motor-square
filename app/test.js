// db.products.aggregate([
//     {$match:{price:{$gt:1200}}},
//     {
//         $project:{
//             price:1,
//             discountPrice:{
//                 $multiply:['$price',0.8]
//             }
//         }
//     }
// ])

// const { ApiError } = require("@google/genai");

// db.products.aggregate([
//     {$match:{'price':{$gt:1200}}},
//     {
//         $group:{
//             _id:"$price",
//             allColors:{$push:'$colors'}
//         }
//     }
// ])

// db.products.aggregate([
//     {$unwind:'$colors'},
//     {$match:{price:{$gt:1200}}},
//     {
//         $group:{
//             _id:'$price',
//         allColors:{$addToSet:'$colors'}
//         }
//     }
// ])

// db.products.aggregate([
//     {$match:{price:{$gt:1200}}},
//     {$unwind:"$colors"},
//     {
//         $group:{
//             _id:{priceGroup:"$price"},
//             colors:{$addToSet:"$colors"}
//         },
//     },
//     {
//         $project:{
//             _id:1,
//             colors:1,
//             colorsLength:{$size:"$colors"}
//         }
//     },
//     {
//         $limit:1
//     }
// ])


// db.cols.aggregate([
//     {
//         $project:{
//             name:1,
//             pkValue:{
//                 $filter:{
//                     input:'$values',
//                     as:'val',
//                     cond:{ $gt:['$$val',30]}
//                 }
//             }
//         }
//     }
// ])

// AGGREGATION PIPELINES


// const getUserChannelProfile=asyncHandler(async(req,res)=>{
//     const {username}=req.params;

//     if(!username?.trim()){
//         throw new ApiError(400,"username is missing")
//     }

// const channel = await User.aggregate([
//     {
//          $match:{
//           username:username?.toLowerCase()
//          }
//     },
//     {
//         $lookup:{
//             from:"subscription",
//             localField:"_id",
//             foreignField:"channel",
//             as:"subscribers"
//         }

//     },
//     {
//         $lookup:{
//              from:"subscription",
//             localField:"_id",
//             foreignField:"subscriber",
//             as:"subscribeTo"
//         }
//     },
//     {
//         $addFields:{
//             subscribersCount:{
//                 $size:"$subscribers"
//             },
//             channelSubscribedToCount:{
//                   $size:"$subscribeTo"
//             },
//             isSubscribed:{
//                 $cond:{
//                     if:{$in:[req.user?._id,'$subscribers.subscriber']},
//                     then:true,
//                     else:false
//                 }
//             }
//         }
//     },
//     {
//         $project:{
//             fullName:1,
//             username:1,
//             subscribersCount:1,channelSubscribedToCount:1,
//             isSubscribed:1,
//             avatar:1,
//             coverImage:1,
//             email:1
//         }
//     }
    
//    ])

//    if(!channel?.length){
//     throw new ApiError(404,"channel does not exist")
//    }

//    return res.status(200).json(
//     new ApiResponse(200,channel[0],"User Channel Fetched Successfully")
//    )
// })


// const getWatchHistory=asyncHandler(async(req,res)=>{
//     const user=await User.aggregate([
//         {
//             $match:{
//                 _id:new mongoose.Types.ObjectId(req.user._id)
//             }
//         },
//         {
//             $lookup:{
//                 from:"videos",
//                 localField:"watchHistory",
//                 foreignField:"_id",
//                 as:"watchHistory",
//                 pipeline:[
//                     {
//                     $lookup:{
//                         from:"users",
//                         localField:"owner",
//                         foreignField:"_id",
//                         as:"owner",
//                         pipeline:[
//                         {
//                             $project:{
//                                 fullName:1,
//                                 username:1,
//                                 avatar:1
//                             }
//                         },{

//                         }
//                         ]
//                     }
//                     },
//                     {
//                         $addFields:{
//                             owner:{
//                                 $first:"$owner"
//                             }
//                         }
//                     }
//                 ]
//             }
//         }
//     ])

//     return res.status(200).json(
//         new ApiResponse(
//             200,
//             user[0].watchHistory,
//             "Watvh History Fetched Successfully"
//         )
//     )
// })


