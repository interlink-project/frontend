import PropTypes from "prop-types";
import "./Lightbox.css";
import { useTranslation } from "react-i18next";
const Lightbox = (props) => {
  const { onClose, children, datacyChildren, datacyClose } = props;
  const { t } = useTranslation();

  return (
    <div className="lightbox">
      <div
        className="lightbox__content"
        data-cy={`lightbox-children-${datacyChildren}`}
      >
        {children}
        <button
          className="lightbox__close"
          data-cy={`lightbox-close-${datacyClose}`}
          onClick={onClose}
        >
          {t("Close")}
        </button>
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
