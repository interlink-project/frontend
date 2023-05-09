import { useCustomTranslation } from "hooks/useDependantTranslation";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import useMounted from "../../../hooks/useMounted";


import { assetsApi } from "__api__";

const RedirectProcessAsset = () => {
  const dispatch = useDispatch();
  const mounted = useMounted();
  const { process } = useSelector((state) => state.process);
  const navigate = useNavigate();
  const t = useCustomTranslation(process && process.language);
  const { processId, assetId } = useParams();

  useEffect(() => {
    //dispatch(getProcess(processId, false));

    assetsApi.get(assetId).then((res) => {
      if (mounted.current) {
        console.log(res);
        const selectedAsset = res;

        let redirectLink='';

        let completelinktoAsset = "";
         if (selectedAsset.type === "internalasset") {
        //   const backend = selectedAsset["software_response"]["backend"];
        //   const linktoAsset =
        //     backend + "/" + selectedAsset["external_asset_id"];

        //   //alert(`${linktoAsset}/view`);

        //   completelinktoAsset = `${linktoAsset}/view`;
          redirectLink=selectedAsset.link+'/view';
         } else {
        //   //alert(asset.uri);
        //   completelinktoAsset = selectedAsset.uri;
          redirectLink=selectedAsset.uri;
         }
        // alert("Navegate to: " + completelinktoAsset);
        //navigate(selectedAsset.link);
        window.location.replace(redirectLink);
      }
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>{t("dashboard-title")}</title>
      </Helmet>
    </>
  );
};

export default RedirectProcessAsset;
