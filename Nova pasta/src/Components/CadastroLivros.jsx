import { useEffect, useState } from "react";
import "./CadastroLivros.css";

const API = 'http://localhost:9090/livros'

export default function CadastroLivros() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [anoPublicacao, setAnoPublicacao] = useState("");
  const [livros, setLivros] = useState([]);
  const [idEdicao, setIdEdicao] = useState(null);


  async function listar() {
    const resposta = await fetch(API)

    if (resposta.ok) {
      setLivros(await resposta.json())
    }
  }

  useEffect(() => { listar() }, []);

  async function adicionar(livro) {
    const resposta = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(livro)
    })
    if (!resposta.ok) {
      alert('Não foi possível cadastrar o livro')
      return
    }

    const novoLivro = await resposta.json()
    setLivros(anteriores => [...anteriores, novoLivro])
    limpar()
  }

  async function remover(id) {
    const resposta = await fetch(`${API}/${id}`, {
      method: 'DELETE'})
      if(!resposta.ok) {
        alert('Não foi possível remover o livro')
        return
      }
      setLivros(anteriores => anteriores.filter(livro => livro.id !== id))

      if (idEdicao === id){
        limpar()
      }
    }

  function editar(livro) {
    setTitulo(livro.titulo);
    setAutor(livro.autor);
    setAnoPublicacao(String(livro.anoPublicacao));
    setIdEdicao(livro.id);
  }

  async function salvar(e) {
    e.preventDefault(); // Evita recarregar a página ao enviar o formulário

    if (
      titulo.trim() === "" ||
      autor.trim() === "" ||
      anoPublicacao === "" ||
      Number(anoPublicacao) < 0
    ) {
      return;
    }

    const livro = {
      titulo: titulo.trim(),
      autor: autor.trim(),
      anoPublicacao: Number(anoPublicacao)
    }

    if (idEdicao === null) {
      await adicionar(livro);
    } else {
      const resposta = await fetch(`${API}/${idEdicao}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(livro)
      })

      if (!resposta.ok) {
        alert('Não foi possível atualizar o livro.')
        return
      }
      const livroAtualizado = await resposta.json()

      setLivros(anteriores =>
        anteriores.map(livro =>
          livro.id === idEdicao ? livroAtualizado : livro
        )
      )
      limpar();
    }
  }

  function limpar() {
    setTitulo("");
    setAutor("");
    setAnoPublicacao("");
    setIdEdicao(null);
  }

  return (
    <main className="container">
      <header className="header">
        <h1>Controle de Livros</h1>
        <span className="badge">
          {livros.length} {livros.length === 1 ? "livro" : "livros"}
        </span>
      </header>

      <form onSubmit={salvar}>
        <div className="form-grid">
          <input
            className="input-field"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título do livro"
            required
          />
          <input
            className="input-field"
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
            placeholder="Nome do autor"
            required
          />
          <input
            className="input-field"
            type="number"
            value={anoPublicacao}
            onChange={(e) => setAnoPublicacao(e.target.value)}
            placeholder="Ano"
            min="0"
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {idEdicao === null ? "Adicionar Livro" : "Salvar Alterações"}
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

      {livros.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum livro cadastrado ainda. Preencha os campos acima.</p>
        </div>
      ) : (
        <ul className="book-list">
          {livros.map((livro) => (
            <li
              key={livro.id}
              className={`book-card ${idEdicao === livro.id ? "editing" : ""}`}
            >
              <div className="book-info">
                <h3>{livro.titulo}</h3>
                <p>
                  {livro.autor} • Publicado em {livro.anoPublicacao}
                </p>
              </div>

              <div className="book-actions">
                <button
                  type="button"
                  onClick={() => editar(livro)}
                  className="btn btn-sm btn-edit"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => remover(livro.id)}
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