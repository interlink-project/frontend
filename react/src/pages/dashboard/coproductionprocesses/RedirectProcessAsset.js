import { useCustomTranslation } from "hooks/useDependantTranslation";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import useMounted from "../../../hooks/useMounted";

import { assetsApi, teamsApi } from "__api__";
import useAuth from "hooks/useAuth";

const RedirectProcessAsset = () => {
  const dispatch = useDispatch();
  const mounted = useMounted();
  const { process } = useSelector((state) => state.process);
  const navigate = useNavigate();
  const t = useCustomTranslation(process && process.language);
  const { processId, assetId } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const res = await assetsApi.get(assetId);

        if (mounted.current) {
          const selectedAsset = res;
          let redirectLink = "";

          if (selectedAsset.type === "internalasset") {
            redirectLink = selectedAsset.link + "/view";
          } else {
            redirectLink = selectedAsset.uri;
          }
          window.location.replace(redirectLink);
        }
      } catch (error) {
        if (error.response.status == 403) {
          //Add user to observers
          alert('Agrego a observadores');
          try {
            const res = await teamsApi.addObservers({
              users_ids: [user.id],
              coproduction_process_id: processId,
              asset_id: assetId,
            });
            if (mounted.current) {
              //Try again to load resource
              alert('Intento de nuevo acceder');
              fetchAsset();
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
    };

    fetchAsset();
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
