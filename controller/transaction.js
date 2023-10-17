const client = require("../db/connect");

const donateblood = async(req,res)=>{
    try{
        const id = req.user.id;
        const blood = req.user.blood;
        const dob = req.user.dob;
        donation_date = new Date();
        is_available = true;
        hospital = req.body.hospital;
        quantity = req.body.quantity;
        const age =  donation_date.getFullYear() - dob.getFullYear();
        if(age<18){
            return res.status(400).json({error:"You need to be atleast 18+ to donate"});
        }
        else{
            const text = "insert into donation(fk_user,blood,donation_date,quantity,hospital,is_available) values ($1,$2,$3,$4,$5,$6)";
            const param = [id,blood,donation_date,quantity,hospital,true];
            await client.query(text,param);
            res.status(201).json({msg:"Successfully Donated"});
        }


    }
    catch(err){
        res.status(500).json({error:"Internal Server Error"});
    }
}

const getactivedonations = async(req,res)=>{
    try{
        const id = req.user.id;
        const response = await client.query("select * from donation where fk_user = $1 and is_available = true",[id]);
        if(response.rows.length > 0){
            return res.status(200).json({donation:response.rows});
        }
        else{
            return res.status(400).json({error:"You have no active donations"});
        }

    }catch(err){
        res.status(500).json({error:"Internal Server Error"});
    }
}
