const router = require('express').Router();
const instance = require('../../../paymentInstance')

router.use('/order/:amount',async(req,res)=>{
    try {
        const {amount} = req.params;
        const options = {
            amount:amount*100,
            currency:'INR',
            receipt:'asf68745a5454AS@@@@##%Tr432cASF'
        }
     instance.orders.create(options,(err,order)=>{
         if(err){
             return res.status(500).json({message:'Something went wrong ! Transaction must be below 5 lakh only '})
         }
         return res.status(200).json(order)
     })
    } catch (error) {
        return res.status(500).json({message: 'Something went wrong ! May be try later '});
    }
})


router.post('/verify',async(req, res) => {
    try {
     const text = req.body.order_id + '|'+ req.body.razorpay_id;
     const secret = process.env.RAZORPAY_SECRET_KEY;
     const algo = 'sha256';
     let hash,hmac;
     hmac = crypto.createHmac(algo,secret);
     hmac.update(text);
     hash = hmac.digest('hex');
     if(hash==req.body.razorpay_signature){
      return res.send('payment successfull')
     }
     else{
        return res.send('payment failure')
     }
    } catch (error) {
      return res.send('payment failure')
    }
   })

module.exports = router