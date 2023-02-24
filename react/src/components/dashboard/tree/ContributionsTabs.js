import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ContributionsTable from 'components/dashboard/tree/ContributionsTable';
import { objectivesApi, phasesApi, tasksApi, usersApi } from '__api__';
import useMounted from 'hooks/useMounted';
import { useCustomTranslation } from 'hooks/useDependantTranslation';


const ContributionsTabs = ({contributions}) => {
    const [rows, setRows] = useState([]);
    const { process } = useSelector((state) => state.process);
    const t = useCustomTranslation(process.language);
   
    useEffect(() => {
        console.log(contributions);
        if (contributions.length === 0) {
            console.log("NO CONTRIBUTIONS");
            setRows([]);
            return;
        }
        let contribs = {};
        for (let i = 0; i < contributions.length; i++) {
            for (let j = 0; j < contributions[i].contributors.length; j++) {
                if (!contribs[contributions[i].contributors[j].user_id]) {
                    contribs[contributions[i].contributors[j].user_id] = 1;
                } else {
                    contribs[contributions[i].contributors[j].user_id] += 1;
                }
            }
        }

        for (let id in contribs) {
            usersApi.get(id).then((res) => {
                setRows(rows => [...rows, { id: id, name: res.full_name, contribution: "Average" }]);
            }).catch((err) => {
                console.log(err);
            });
        }

    }, [contributions]);

    return (
        <>
            <p> {t("Contributions")} </p>
            <ContributionsTable
                rows={rows}
                assets={contributions}
            />
        </>
    );
}

export default ContributionsTabs;