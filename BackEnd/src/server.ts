import express from "express";
import cors from "cors";
import addUserItem from "./Dynamodb/userTable";
import pickLeads from "./Dynamodb/pickLeads";
import LoginConfirmation from "./Dynamodb/LoginConfirmation"
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors())

app.post("/add-user", async (req, res)=>{
    try {
        const result = await addUserItem(req.body);
        res.status(200).json({message: "usuario registrado"})
    }catch(error){
        res.status(500).json({message: "usuario não registrado"});
    }
})

app.post("/leadsPicker", async (req, res) => {
    const { country, limit } = req.body; 

    if (!country || !limit) {
      res.status(400).json({ message: "country e limit são obrigatórios." });
      return;
    }
  
    const response = await pickLeads(country, parseInt(limit, 10)) 
      
    if (response.statusCode === 200) {
      res.status(200).json({ message: "Leads encontrados", leads: response.data });
    } else if (response.statusCode === 404) {
      res.status(404).json({ message: "Nenhum lead encontrado" });
    } else if (response.statusCode === 500) {
      res.status(500).json({ message: "Erro ao buscar leads", error: response.error });
    } else {
      res.status(500).json({ message: "Erro inesperado" });
    }
  }
);
  


app.post("/login", async (req, res)=>{
  const { loginEmail, loginPassword } = req.body; 

  if (!loginEmail || !loginPassword) {
    res.status(401).json({ message: "email e senha são obrigatórios." });
    return;
  }
    const result =  await LoginConfirmation(loginEmail,loginPassword );
    if(result){
    res.status(200).json({message: "Login Encontrado"})
    }
    if(!result){
    res.status(400).json({ message: "Erro ao Achar Conta" });
  }
});




app.listen(process.env.PORT, () => {
    console.log('servidor rodando')
})