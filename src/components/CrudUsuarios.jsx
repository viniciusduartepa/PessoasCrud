import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPencil, FaTrashCan } from 'react-icons/fa6';
import "../styles/Usuarios.css"

export default function CrudUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [id, setId] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [operacao, setOperacao] = useState("");
  const url = "https://api-pessoas.vercel.app/usuarios/";

  useEffect(() => {
    fetch(url)
      .then((respFetch) => respFetch.json())
      .then((respJson) => setUsuarios(respJson))
      .catch((err) => console.log(err));
  }, [url]);

  function novosDados() {
    setOperacao("criarRegistro");

  }
  function limparDados() {
    setId("");
    setNome("");
    setEmail("");
    setAltura("");
    setPeso("");
    setOperacao("");
  }

  function editarDados(cod) {
    let usuario = usuarios.find((item) => item.id === cod);
    const { id, nome, email, altura, peso } = usuario;
    setOperacao("editarRegistro");
    setId(id);
    setNome(nome);
    setEmail(email);
    setAltura(altura);
    setPeso(peso);
  }

  function atualizaListaUsuarioEditado(response) {
    let { identificador } = response.data;
    const index = usuarios.findIndex(item => item.id == identificador);
    let users = usuarios;
    console.log(users);
    users[index].nome = nome;
    users[index].email = email;
    users[index].altura = altura;
    users[index].peso = peso;
    setUsuarios(users);
    limparDados("");
  }

  function atualizaListaComNovoUsuario(response) {
    console.log(response);
    let { id, nome, email, altura, peso } = response.data;
    let obj = {
      "id": id, "nome": nome, "email": email,
      "altura": altura, "peso": peso
    };
    let users = usuarios;
    users.push(obj);
    setUsuarios(users);
    limparDados("");
  }

  function apagarDados(cod) {
    axios.delete(url + cod)
      .then(() => setUsuarios(usuarios.filter(item => item.id !== cod)))
      .catch((erro) => console.log(erro));
  }

  function gravarDados() {
    if (nome !== "" && email !== "") {
      if
        (operacao === "criarRegistro") {
        axios
          .post(url, {
            nome: nome,
            email: email,
            altura: altura,
            peso: peso,
          })

          .then((response) => atualizaListaComNovoUsuario(response))
          .catch((err) => console.log
            (err));
      } else if
        (operacao === "editarRegistro") {
        axios.put
          (url + id, {
            id: id,
            nome: nome,
            email: email,
            altura: altura,
            peso: peso,
          }).then((response) => atualizaListaUsuarioEditado(response))
          .catch((err) => console.log(err));
      }
    } else {
      console.log("Preencha os campos");
    }
  }
  return (
    <div id="containerGeral">

      <button type="button" onClick={novosDados}>Novo</button>
      <input type="text" name="txtNome " value={nome} onChange={(e) => { setNome(e.target.value); }} />
      <input type="text" name="txtEmail" value={email} onChange={(e) => { setEmail(e.target.value); }} />
      <input type="number" name="txtAltura" value={altura} onChange={(e) => setAltura(e.target.value)} />
      <input type="number" name="txtPeso" value={peso} onChange={(e) => setPeso(e.target.value)} />
      <button type="button" onClick={limparDados}>Cancelar</button>
      <button type="button" onClick={gravarDados}>Gravar</button>
      {usuarios ? usuarios.map((item) => {
        return (<div key={item.id}>
          {item.id} - {item.nome} - {item.email} - {item.altura} - {item.peso} - {" "}
          <FaPencil onClick={(e) => editarDados(item.id)} />
          <FaTrashCan onClick={(e) => apagarDados(item.id)} />
        </div>
        );
      }) : false}
    </div>
  );
}
