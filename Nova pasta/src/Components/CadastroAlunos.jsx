import { useEffect, useState } from "react";
import "./CadastroAlunos.css";

const API = 'http://localhost:9090/alunos'

export default function CadastroAlunos() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [idAluno, setIdAluno] = useState(null);
  const [alunos, setAlunos] = useState([]);


  async function listar() {
    const resposta = await fetch(API)

    if (resposta.ok) {
      setAlunos(await resposta.json())
    }
  }

  useEffect(() => { listar() }, []);

  async function adicionar(aluno) {
    const resposta = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(aluno)
    })
    if (!resposta.ok) {
      alert('Não foi possível cadastrar o aluno')
      return
    }

    const novoAluno = await resposta.json()
    setAlunos(anteriores => [...anteriores, novoAluno])
    limpar()
  }

  async function remover(id) {
    const resposta = await fetch(`${API}/${id}`, {
      method: 'DELETE'})
      if(!resposta.ok) {
        alert('Não foi possível remover o aluno')
        return
      }
      setAlunos(anteriores => anteriores.filter(aluno => aluno.id !== id))

      if (idAluno === id){
        limpar()
      }
    }

  function editar(aluno) {
    setNome(aluno.aluno);
    setEmail(aluno.email);
    setIdAluno(aluno.id);
  }

  async function salvar(e) {
    e.preventDefault(); // Evita recarregar a página ao enviar o formulário

    if (
      nome.trim() === "" ||
      email.trim() === "" 
    ) {
      return;
    }

    const aluno = {
      aluno: nome.trim(),
      email: email.trim(),
    }

    if (idAluno === null) {
      await adicionar(aluno);
    } else {
      const resposta = await fetch(`${API}/${idAluno}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aluno)
      })

      if (!resposta.ok) {
        alert('Não foi possível atualizar o aluno.')
        return
      }
      const livroAtualizado = await resposta.json()

      setLivros(anteriores =>
        anteriores.map(aluno =>
          aluno.id === idAluno ? livroAtualizado : aluno
        )
      )
      limpar();
    }
  }

  function limpar() {
    setNome("");
    setEmail("");
    setIdAluno(null);
  }

  return (
    <main className="container">
      <header className="header">
        <h1>Controle de Alunos</h1>
        <span className="badge">
          {alunos.length} {alunos.length === 1 ? "aluno" : "alunos"}
        </span>
      </header>

      <form onSubmit={salvar}>
        <div className="form-grid">
          <input
            className="input-field"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome do aluno"
            required
          />
          <input
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email do aluno"
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {idEdicao === null ? "Adicionar Aluno" : "Salvar Alterações"}
          </button>

          {idEdicao !== null && (
            <button
              type="button"
              onClick={limpar}
              className="btn btn-secondary"
            >
              Cancelar Edição
            </button>
          )}
        </div>
      </form>

      {alunos.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum aluno cadastrado ainda. Preencha os campos acima.</p>
        </div>
      ) : (
        <ul className="student-list">
          {alunos.map((aluno) => (
            <li
              key={aluno.id}
              className={`student-card ${idEdicao === aluno.id ? "editing" : ""}`}
            >
              <div className="student-info">
                <h3>{aluno.nome}</h3>
                <p>
                  {aluno.email}
                </p>
              </div>

              <div className="student-actions">
                <button
                  type="button"
                  onClick={() => editar(aluno)}
                  className="btn btn-sm btn-edit"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => remover(aluno.id)}
                  className="btn btn-sm btn-delete"
                >
                  Remover
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}