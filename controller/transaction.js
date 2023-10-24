
const client = require("../db/connect");

const donateblood = async(req,res)=>{
    try{
        console.log(req.user);
        const id = req.user.user_id;
        const blood = req.user.blood;
        const dob = req.user.dob;
        donation_date = new Date();
        is_available = true;
        hospital = req.body.hospital;
        quantity = req.body.quantity;
        weight = req.body.weight;
        let kans = await client.query("select * from donation where fk_user = $1 order by donation_date DESC limit 1",[id]);
        if(kans.rows.length===0){
            if(weight<=40){
                return res.status(400).json({error:"You are under-weight"});
            }
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
        else{
            const differenceInMilliseconds = donation_date - kans.rows[0].donation_date ;
            const millisecondsInThreeMonths = 3 * 30 * 24 * 60 * 60 * 1000;
            if (differenceInMilliseconds > millisecondsInThreeMonths) {
                console.log('The difference is greater than 3 months.');
                if(weight<=40){
                    return res.status(400).json({error:"You are under-weight"});
                }
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
        
              } else {
                console.log('The difference is not greater than 3 months.');
                return res.status(400).json({error:"Your previous donation has not been over 3 months"});
              
              }

        }
       

    }
    catch(err){
        res.status(500).json({error:"Internal Server Error"});
    }
}

const getactivedonations = async(req,res)=>{
    try{
        const id = req.user.user_id;
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

const show_transcation = async(req,res)=>{
    try{
        const id = req.user.user_id;
        const name = req.user.first_name;
        let rname = ""
        let dname = ""
        const response = await client.query("select * from transaction where donar_id = $1 or receiver_id = $1",[id]);
        
        if(response.rows.length > 0){
            if(response.rows[0].Receiver_id===id){
                rname = name;
                const d = await client.query("select first_name from users where user_id = $1",[response.rows[0].Donar_id]);
                dname = d.rows[0].first_name;
            }
            else{
                dname = name;
                const d = await client.query("select first_name from users where user_id = $1",[response.rows[0].Receiver_id]);
                rname = d.rows[0].first_name;
            }
            return res.status(200).json({donation:response.rows,rname:rname,dname:dname});
        }
        else{
            return res.status(400).json({error:"Your History is empty"});
        }

    }catch(err){
        res.status(500).json({error:"Internal Server Error"});
    }
}


// create table receive(
//     fk_user int,
//     receive_date Date,
//     hospital VARCHAR(1000),
//     quantity NUMERIC(10, 2),
//     CONSTRAINT fk_user FOREIGN KEY(fk_user) REFERENCES users(user_id) ON DELETE CASCADE
// )
const show_donation = async(req,res)=>{
    try{
        const id = req.user.user_id;
        const blood = req.user.blood;
        const text = "select * from donation where blood = $1 and is_available = true ";
        const result = await client.query(text,[blood]);
        if(result.rows.length<=0){
            return res.status(400).json({error:"No active Donations"});
           }
        return res.status(200).json({donation:result.rows})  
    }catch(err){
        return res.status(500).json({error:"Internal Server Error"});
    }
}
const receive = async (req,res)=>{
    try{
       const id = req.user.user_id;
       const d_id = req.user.d_id;
       const text  = "select * from donation where id = $1"
       const result = await client.query(text,[d_id]);
       if(result.rows.length<=0){
        return res.status(400).json({error:"No such Donations exist."});
       }
       else{
        const donar = result.rows[0];
         
            await client.query("update donation set is_available = $1 where id = $2",[false,donar.id]);
            await client.query("insert into transaction(donar_id,receiver_id,blood,quantity,created_at) values ($1,$2,$3,$4,$5)",
            [donar.fk_user,id,blood,1,Date.now()]);
      
       }
    }
    catch(e){
          return res.status(500).json({error:"Internal Server Error"});
    }
}


const getallblood = async(req,res)=>{
    try{
        const text = "select blood,sum(quantity) from donation where is_available = true group by blood ";
        const response = await client.query(text,[]);
        return res.status(200).json({blood:response.rows});

    }catch(e){
        return res.status(500).json({error:"Internal Server Error"});
    }
}


module.exports = {getallblood,getactivedonations,receive,show_transcation,donateblood,show_donation};