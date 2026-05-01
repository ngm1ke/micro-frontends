declare module "react_remote_app/Button" {
  const Button: React.FC<{
    text: string;
    onClick?: () => void;
  }>;
  export default Button;
}

declare module "react_remote_app/Header" {
  const Header: React.FC;
  export default Header;
}