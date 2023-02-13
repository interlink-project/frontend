import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ContributionsTable from 'components/dashboard/tree/ContributionsTable';
import { objectivesApi, phasesApi, tasksApi, usersApi } from '__api__';


const ContributionsTabs = () => {
    const [contributors, setContributors] = useState([]);
    const { process, updatingTree, treeitems, selectedTreeItem, isAdministrator } = useSelector((state) => state.process);

    useEffect(() => {
        setContributors([]);
        tasksApi.getAssetsAndContributions(selectedTreeItem.id).then(data => {
            let contribs = {};
            for (let i = 0; i < data.assetsWithContribution.length; i++) {
                for (let j = 0; j < data.assetsWithContribution[i].contributors.length; j++) {
                    if (!contribs[data.assetsWithContribution[i].contributors[j].user_id]) {
                        contribs[data.assetsWithContribution[i].contributors[j].user_id] = 1;
                    } else {
                        contribs[data.assetsWithContribution[i].contributors[j].user_id] += 1;
                    }
                }
            }
            // EL problema es que se envia varias veces el estado de contributors y pisa el anterior hay que actualizarlo solo 1 vez
            console.log("UPDATING CONTRIBS");
            console.log(contribs);
            console.log(contributors);
            const tmp_contribs = [];
            for (const [key, value] of Object.entries(contribs)) {
                usersApi.get(key).then((res) => {
                    tmp_contribs.push({ id: key, name: res.full_name, contributions: value });
                    setContributors([...contributors, { id: key, name: res.full_name, contributions: value }]);
                });
            }
            console.log(tmp_contribs);

            
        })
    }, [selectedTreeItem]);


    return (
        <>
            <p> Contributions </p>
            <ContributionsTable
                contributors={contributors}
            />
        </>
    );
}

export default ContributionsTabs;