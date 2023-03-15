import { Card, Chip, Typography } from '@mui/material';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import { useSelector } from 'react-redux';

import UserAvatar from 'components/UserAvatar';


const ContributionCard = ({ user_id, name, contribution_level }) => {
    const { process } = useSelector((state) => state.process);
    const t = useCustomTranslation(process.language);

    const handleColor = (level) => {
        switch (level) {
            case 'Low':
                return 'error';
            case 'Average':
                return 'warning';
            case 'High':
                return 'success';
            default:
                return 'warning';
        }
    };


    return (
        <Card sx={{ textAlign: 'center', p: 2 }}>
            <UserAvatar
                id={user_id}
                sx={{ margin: 'auto' }}
            />
            <Typography variant="h6" sx={{ mt: 2 }}>
                {name}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
                {t("Level of contribution")}
            </Typography>
            <Chip label={contribution_level} sx={{ mt: 1 }} color={handleColor(contribution_level)} />
        </Card >

    );
}

export default ContributionCard;