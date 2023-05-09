import PropTypes from "prop-types";
import "./Lightbox.css";
import { Link } from "@mui/material";

const Lightbox = (props) => {
  const { onClose, children, datacyChildren, datacyClose } = props;

  return (
    <div
      className="lightbox"
      onClick={() => {
        onClose();
      }}
    >
      <div
        className="lightbox__content"
        data-cy={`lightbox-children-${datacyChildren}`}
        onClick={(e) => e.stopPropagation()}
      >
        <Link
          className="lightbox__close"
          data-cy={`lightbox-close-${datacyClose}`}
          onClick={onClose}
        ></Link>
        {children}
      </div>
    </div>
  );
};

Lightbox.propTypes = {
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  datacyChildren: PropTypes.string,
  datacyClose: PropTypes.string,
};

Lightbox.defaultProps = {
  datacyChildren: "noName",
  datacyClose: "noName",
};

export default Lightbox;
