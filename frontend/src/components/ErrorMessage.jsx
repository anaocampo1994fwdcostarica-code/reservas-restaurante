import Icon from './Icon';
export default function ErrorMessage({ mensaje }) {
  return <div className="alert alert--error" role="alert"><Icon name="alert" size={19} /><div><strong>No pudimos cargar la información</strong><p>{mensaje}</p></div></div>;
}
