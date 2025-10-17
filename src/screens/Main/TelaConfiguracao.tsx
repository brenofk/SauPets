import React from 'react';
import './TelaConfiguracao.css'; // Estilos separados para melhor organização
import { FaHome } from 'react-icons/fa'; // Ícone de casa

const TelaConfiguracao: React.FC = () => {
  return (
    <div className="tela-config-wrapper">
      <div className="card-config">
        <h1 className="titulo">Configuração</h1>

        <div className="links">
          <a href="/alterar-dados" className="link-config">alterar dados</a>
          <a href="/excluir-conta" className="link-config">excluir conta</a>
        </div>

        <button className="botao-inicio">
          <FaHome className="icone-casa" />
          Início
        </button>
      </div>
    </div>
  );
};

export default TelaConfiguracao;
