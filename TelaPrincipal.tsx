// Arquivo: TelaPrincipal.tsx

import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background-color: #ecf0f5;
  height: 100vh;
  width: 100%;
`;

const Header = styled.header`
  background-color: #5a7bbd;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
`;

const UserImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const UserName = styled.span`
  color: #000000;
  font-size: 16px;
`;

const MenuIcon = styled.div`
  width: 24px;
  height: 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;

  div {
    background-color: white;
    height: 3px;
    width: 100%;
    border-radius: 2px;
  }
`;

const TelaPrincipal: React.FC = () => {
  return (
    <Container>
      <Header>
        <UserSection>
          <UserImage src="foto.jpg" alt="Foto do Usuário" />
          <UserName>Current User's nome</UserName>
        </UserSection>
        <MenuIcon>
          <div />
          <div />
          <div />
        </MenuIcon>
      </Header>
      {/* Conteúdo da tela principal aqui */}
    </Container>
  );
};

export default TelaPrincipal;
