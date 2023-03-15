import {
  Alert, Avatar, Box, Button, IconButton, Switch, Table, TableBody, TableCell, TableHead, TableRow, Typography
} from '@mui/material';
import { green, red } from '@mui/material/colors';
import { CheckOutlined, Close, Delete } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import ConfirmationButton from 'components/ConfirmationButton';
import useAuth from 'hooks/useAuth';
import useDependantTranslation, { useCustomTranslation } from 'hooks/useDependantTranslation';
import PermissionCreate from 'components/dashboard/coproductionprocesses/PermissionCreate';
import TeamProfile from 'components/dashboard/organizations/TeamProfile';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getProcess, getTree } from 'slices/process';
import { tree_items_translations } from 'utils/someCommonTranslations';
import { permissionsApi } from '__api__';
import { OrganizationChip } from '../../Icons';

const PermissionRow = ({ permission, showOnlyMine, setSelectedTeam, isAdministrator = false, onChanges }) => {
  const { user } = useAuth();
  const { t } = useDependantTranslation();
  const dispatch = useDispatch();

  const handleDelete = () => {
    permissionsApi.delete(permission.id).then(onChanges);
  };

  return (
    <TableRow hover>
      {isAdministrator && (
        <TableCell align='center'>
          <ConfirmationButton
            key={`${permission.id}-delete-action`}
            Actionator={({ onClick }) => (
              <IconButton onClick={onClick}>
                <Delete />
              </IconButton>
            )}
            ButtonComponent={({ onClick }) => (
              <LoadingButton
                sx={{ mt: 1 }}
                fullWidth
                variant='contained'
                color='error'
                onClick={onClick}
              >
                {t('Confirm deletion')}
              </LoadingButton>
            )}
            onClick={handleDelete}
            text={t('Are you sure you want to remove this permission?')}
          />

        </TableCell>
      )}

      {!showOnlyMine && !isAdministrator && (
        <TableCell align='center'>
          {permission.user_id == user.id || user.teams_ids.includes(permission.team_id) ? <CheckOutlined style={{ color: green[500] }} /> : <Close style={{ color: red[500] }} />}
        </TableCell>
      )}
      <TableCell align='center'>
        <Button
          size='small'
          startIcon={<Avatar src={permission.team.logotype_link} />}
          onClick={() => setSelectedTeam(permission.team_id)}
          variant='text'
        >
          {permission.team && permission.team.name}
        </Button>
      </TableCell>
      <TableCell align='center'>
        {permission.team && (
          <OrganizationChip
            type={permission.team.type}
            t={t}
          />
        )}
      </TableCell>
      <TableCell align='center'>
        {permission.access_assets_permission ? <CheckOutlined style={{ color: green[500] }} /> : <Close style={{ color: red[500] }} />}
      </TableCell>
      <TableCell align='center'>
        {permission.create_assets_permission ? <CheckOutlined style={{ color: green[500] }} /> : <Close style={{ color: red[500] }} />}
      </TableCell>
      <TableCell align='center'>
        {permission.delete_assets_permission ? <CheckOutlined style={{ color: green[500] }} /> : <Close style={{ color: red[500] }} />}
      </TableCell>

    </TableRow>
  );
};

const PermissionsTable = ({ your_permissions, your_roles, language, processId, onChanges, element, isAdministrator }) => {
  const [permissions, setPermissions] = React.useState([]);
  const [selectedTeam, setSelectedTeam] = React.useState(null);
  const [showOnlyMine, _setShowOnlyMine] = React.useState(!isAdministrator);
  const { user } = useAuth();

  const dispatch = useDispatch();
  const t = useCustomTranslation(language);
  const treeitem_translations = tree_items_translations(t);

  const [permissionCreatorOpen, setOpenPermissionCreator] = useState(false);
  const [creatingPermission, setCreatingPermission] = useState(false);
  const update = (selectedTreeItemId) => {
    dispatch(getTree(processId, selectedTreeItemId));
  };
  const updateProcess = (selectedTreeItemId) => {
    dispatch(getProcess(processId, false, selectedTreeItemId));
  };

  const isTask = element.type === 'task';
  const isObjective = element.type === 'objective';
  const isPhase = element.type === 'phase';

  const taskPermissions = permissions.filter((permission) => permission.treeitem_id === element.id);
  const objectivePermissions = permissions.filter((permission) => permission.treeitem_id === (isObjective ? element.id : element.objective_id));
  const phasePermissions = permissions.filter((permission) => permission.treeitem_id === (isPhase ? element.id : element.phase_id));
  const processPermissions = permissions.filter((permission) => permission.treeitem_id === null);

  const element_type_translation = treeitem_translations[element.type]

  useEffect(() => {
    setPermissions(element.permissions);
  }, [element]);

  const setShowOnlyMine = (val) => {
    if (val) {
      setPermissions(
        element.permissions.filter((permission) => permission.user_id == user.id || user.teams_ids.includes(permission.team_id))
      );
    } else {
      setPermissions(
        element.permissions
      );
    }
    _setShowOnlyMine(val);
  };

  const colSpan = 9;

  return (
    <>
      {selectedTeam && (
        <TeamProfile
          teamId={selectedTeam}
          open
          setOpen={setSelectedTeam}
          onChanges={() => update(element.id)}
        />
      )}
      {!isAdministrator && (
        <Alert
          severity='info'
          action={(
            <Switch
              checked={!showOnlyMine}
              onChange={(event) => setShowOnlyMine(!event.target.checked)}
            />
          )}
        >
          {t('Show all the permissions for this tree item, including those ones that do not affect you')}
        </Alert>
      )}
      {isAdministrator && <Alert severity='info'>{t('Permissions set at lower levels prevail over others')}</Alert>}
      <Box sx={{ overflowX: 'scroll' }}>
        <Table
          aria-label='admins-table'
          size='small'
        >
          <TableHead>
            <TableRow>
              {isAdministrator && <TableCell align='center'><>{t('Actions')}</></TableCell>}
              {!showOnlyMine && !isAdministrator && (
                <TableCell align='center'>
                  <>
                    {t('Affects you')}
                    {' '}
                  </>
                </TableCell>
              )}
              <TableCell align='center'><>{t('Team')}</></TableCell>
              <TableCell align='center'><>{t('Team role')}</></TableCell>
              <TableCell align='center'><>{t('access_assets_permission')}</></TableCell>
              <TableCell align='center'><>{t('create_assets_permission')}</></TableCell>
              <TableCell align='center'><>{t('delete_assets_permission')}</></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell
                align='center'
                colSpan={colSpan}
              >
                <Typography
                  variant='subtitle2'
                  sx={{ my: 1, bgcolor: 'background.default' }}
                >
                  {t('Permissions for the overall process')}
                  {' '}
                  (
                  {processPermissions.length}
                  )
                </Typography>
              </TableCell>
            </TableRow>

            {processPermissions.length > 0 && processPermissions.map((permission) => (
              <PermissionRow
                showOnlyMine={showOnlyMine}
                key={permission.id}
                setSelectedTeam={setSelectedTeam}
                permission={permission}
                isAdministrator={isAdministrator}
                onChanges={onChanges}
              />
            ))}
            <TableRow>
              <TableCell
                align='center'
                colSpan={colSpan}
              >
                <Typography
                  variant='subtitle2'
                  sx={{ my: 1, bgcolor: 'background.default' }}
                >
                  {t('Permissions for the phase')}
                  {' '}
                  (
                  {phasePermissions.length}
                  )
                </Typography>
              </TableCell>
            </TableRow>

            {phasePermissions.length > 0 && phasePermissions.map((permission) => (
              <PermissionRow
                showOnlyMine={showOnlyMine}
                key={permission.id}
                setSelectedTeam={setSelectedTeam}
                permission={permission}
                isAdministrator={isAdministrator}
                onChanges={onChanges}
              />
            ))}
            {(isObjective || isTask) && (
              <>
                <TableRow>
                  <TableCell
                    align='center'
                    colSpan={colSpan}
                  >
                    <Typography
                      variant='subtitle2'
                      sx={{ my: 1, bgcolor: 'background.default' }}
                    >
                      {t('Permissions for the objective')}
                      {' '}
                      (
                      {objectivePermissions.length}
                      )
                    </Typography>
                  </TableCell>
                </TableRow>
                {objectivePermissions.length > 0 && objectivePermissions.map((permission) => (
                  <PermissionRow
                    showOnlyMine={showOnlyMine}
                    key={permission.id}
                    setSelectedTeam={setSelectedTeam}
                    permission={permission}
                    isAdministrator={isAdministrator}
                    onChanges={onChanges}
                  />
                ))}
              </>
            )}
            {isTask && (
              <>
                <TableRow>
                  <TableCell
                    align='center'
                    colSpan={colSpan}
                  >
                    <Typography
                      variant='subtitle2'
                      sx={{ my: 1, bgcolor: 'background.default' }}
                    >
                      {t('Permissions for the task')}
                      {' '}
                      (
                      {taskPermissions.length}
                      )
                    </Typography>
                  </TableCell>
                </TableRow>
                {taskPermissions.length > 0 && taskPermissions.map((permission) => (
                  <PermissionRow
                    showOnlyMine={showOnlyMine}
                    key={permission.id}
                    setSelectedTeam={setSelectedTeam}
                    permission={permission}
                    isAdministrator={isAdministrator}
                    onChanges={onChanges}
                  />
                ))}
              </>
            )}

            {showOnlyMine && (
              <>
                <TableRow>
                  <TableCell
                    align='center'
                    colSpan={colSpan}
                  >
                    <Typography
                      variant='subtitle2'
                      sx={{ my: 1, fontWeight: 'bold' }}
                    >
                      {t('Final permissions for you')}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell align='center' />
                  <TableCell align='center'>
                    {your_roles && your_roles.map((role) => (
                      <Box
                        key={role}
                        sx={{ m: 1 }}
                      >
                        <OrganizationChip
                          type={role}
                          t={t}
                        />
                      </Box>
                    ))}
                  </TableCell>
                  <TableCell align='center'>
                    {your_permissions && your_permissions.access_assets_permission ? <CheckOutlined style={{ color: green[500] }} /> : <Close style={{ color: red[500] }} />}
                  </TableCell>
                  <TableCell align='center'>
                    {your_permissions && your_permissions.create_assets_permission ? <CheckOutlined style={{ color: green[500] }} /> : <Close style={{ color: red[500] }} />}
                  </TableCell>
                  <TableCell align='center'>
                    {your_permissions && your_permissions.delete_assets_permission ? <CheckOutlined style={{ color: green[500] }} /> : <Close style={{ color: red[500] }} />}
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </Box>
      {isAdministrator && !showOnlyMine && (
        <Button
          sx={{ mt: 2 }}
          onClick={() => setOpenPermissionCreator(true)}
          fullWidth
          variant='contained'
        >
          {`${t('Add new permission to the')} ${element_type_translation && element_type_translation.toLowerCase()}`}
        </Button>
      )}
      <PermissionCreate
        open={permissionCreatorOpen}
        setOpen={setOpenPermissionCreator}
        onCreate={() => updateProcess(element.id)}
        loading={creatingPermission}
        setLoading={setCreatingPermission}
        treeitem={element}
      />
    </>
  );
};

export default PermissionsTable;
