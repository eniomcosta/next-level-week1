import React from "react";

interface HeaderProps {
  title: string;
}

//O props terá todas as propriedades passadas para o componente
const Header: React.FC<HeaderProps> = (props) => {
  return (
    <header>
      <h1>{props.title}</h1>
    </header>
  );
};

export default Header;
