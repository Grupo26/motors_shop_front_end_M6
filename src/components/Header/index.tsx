import { HTMLAttributes, useContext, useEffect, useState } from "react";
import { elementsMenu } from "../../utils";
import Button from "../Button";
import { Dropdown, DropdownItem, Menu, NameUser, NavigationStyled } from "./style";
import imgLogo from "../../assets/logo.svg"
import { FiMenu } from "react-icons/fi"
import { ModalsContext } from "../../contexts/Modals";
import { useNavigate } from "react-router-dom";
import { SellerContext } from "../../contexts/Seller";

export interface IDropDownProps extends HTMLAttributes<HTMLDivElement> {
  menuIsOpen: boolean;
}

const Header = () => {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [menu, setMenu] = useState(false);
  const [userLength, setUserLength] = useState<number>(0)

  const navigate = useNavigate()

  const { user, addCount, resetUser } = useContext(SellerContext)

  const { handleOpenModalRegisterUser, handleOpenModalLogin, handleOpenModalEditProfile, handleOpenModalEditAddress } = useContext(ModalsContext)

  useEffect(() => {
    setUserLength(Object.keys(user).length)
  }, [userLength])

  const handleClick = () => {
    setMenu(!menu);
  };

  const redirectRegister = () => {
    navigate('/login', { replace: true })
    setTimeout(() => {
      handleOpenModalRegisterUser()
    }, 100)
  }

  const redirectLogin = () => {
    navigate('/login', { replace: true })
    setTimeout(() => {
      handleOpenModalLogin()
    }, 100)
    addCount()
  }

  const logout = () => {
    navigate('./home', { replace: true })
    localStorage.removeItem('@MotorShopTOKEN')
    localStorage.removeItem('@MotorShopUSERID')
    localStorage.removeItem('@MotorShopUSERTYPE')
    localStorage.removeItem('@MotorShopUSERNAME')
    resetUser()
  }

  const openEditAddress = () => {
    handleOpenModalRegisterUser()
  }

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    event.preventDefault();
    const pathname = window.location.pathname;
    if (pathname != "/home") {
      navigate('/home')
    }
    setTimeout(() => {
      const targetElement = document.querySelector(href);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500); // atraso de 500 milissegundos (meio segundo)
  };

  return (
    <NavigationStyled>
      <a href="/home" className="brand-name">
        <img src={imgLogo} alt="logo" />
      </a>
      <button
        className="hamburger"
        onClick={() => setIsNavExpanded(!isNavExpanded)}
      >
        <FiMenu />
      </button>
      <div
        className={
          isNavExpanded ? "navigation-menu expanded" : "navigation-menu"
        }
      >
        <ul>
          {elementsMenu.map((e, index) => {
            return (
              <li key={index}>
                {/* <a href={e.anchor}>{e.name}</a> */}
                <a href={e.anchor} onClick={(event) => handleLinkClick(event, e.anchor)}>
                  {e.name}
                </a>
              </li>
            );
          })}
          <hr />
          <span>
          </span>
          {userLength === 0 ? (
            <>
              <li>
                <button className="login" onClick={() => redirectLogin()}>Fazer Login</button>
              </li>
              <li>
                <button className="register" onClick={() => redirectRegister()}>Cadastrar</button>
              </li>
            </>
          ) : (
            <Menu>
              <NameUser onClick={handleClick}>{user.name}</NameUser>
              <Dropdown menuIsOpen={menu}>
                {user.typeUser === "seller"
                  ?
                  <ul>
                    <DropdownItem onClick={() => handleOpenModalEditProfile()}>Editar Perfil</DropdownItem>
                    <li onClick={() => openEditAddress()}>Editar Endereço</li>
                    <DropdownItem onClick={() => navigate('./admview', { replace: true })}>Meus Anúncios</DropdownItem>
                    <DropdownItem onClick={() => navigate('../login')}>Sair</DropdownItem>
                  </ul>
                  :
                  <>
                    <DropdownItem onClick={() => handleOpenModalEditProfile()}>Editar Perfil</DropdownItem>
                    <DropdownItem onClick={() => openEditAddress()}>Editar Endereço</DropdownItem>
                    <DropdownItem onClick={() => logout()}>Sair</DropdownItem>
                  </>
                }
              </Dropdown>
            </Menu>
          )}
        </ul>
      </div>
    </NavigationStyled>
  );
};

export default Header;
