import { Avatar, AvatarGroup, Box, SvgIcon } from '@material-ui/core';
import { People } from '@material-ui/icons';
import { TreeView } from '@material-ui/lab';
import { statusIcon, TreeItemTypeChip } from 'components/Icons';
import { StyledTreeItem } from 'components/dashboard/tree';
import { useCustomTranslation } from 'hooks/useDependantTranslation';
import { useEffect, useState } from 'react';
import { getAllChildren } from 'slices/process';

const Avat = ({ team }) => (
  <Avatar
    title={team.name}
    src={team.logotype_link}
    sx={{ height: 20, width: 20 }}
  >
    {!team.logotype_link && <People />}
  </Avatar>
);

function arrayUnique(array) {
  const ids = [];
  const newA = [];

  array.forEach((element) => {
    if (!ids.includes(element.id)) {
      ids.push(element.id);
      newA.push(element);
    }
  });

  return newA;
}

function MinusSquare(props) {
  return (
    <SvgIcon
      fontSize='inherit'
      style={{ width: 14, height: 14 }}
      {...props}
    >
      {/* tslint:disable-next-line: max-line-length */}
      <path d='M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z' />
    </SvgIcon>
  );
}

function PlusSquare(props) {
  return (
    <SvgIcon
      fontSize='inherit'
      style={{ width: 14, height: 14 }}
      {...props}
    >
      {/* tslint:disable-next-line: max-line-length */}
      <path d='M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z' />
    </SvgIcon>
  );
}

function CloseSquare(props) {
  return (
    <SvgIcon
      className='close'
      fontSize='inherit'
      style={{ width: 14, height: 14 }}
      {...props}
    >
      {/* tslint:disable-next-line: max-line-length */}
      <path d='M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z' />
    </SvgIcon>
  );
}

const StyledTree = ({ language, parent, selectedTreeItem, setSelectedTreeItem, showIcon = false }) => {
  const [all, setAll] = useState([]);
  const [expanded, setExpanded] = useState([]);

  useEffect(() => {
    const allItems = getAllChildren([parent]);
    setAll(allItems);
    setExpanded(allItems.map((el) => el.id));
  }, [parent]);

  const onSelectedItemChange = (event, nodeId) => {
    const selected = all.find((el) => el.id === nodeId);
    if (selected && (!selectedTreeItem || selectedTreeItem.id !== selected.id)) {
      setSelectedTreeItem(selected);
    }
  };

  const t = useCustomTranslation(language);

  return (
    <TreeView
      aria-label='customized'
      expanded={expanded}
      defaultCollapseIcon={<MinusSquare />}
      defaultExpandIcon={<PlusSquare />}
      defaultEndIcon={<CloseSquare />}
      selected={selectedTreeItem ? selectedTreeItem.id : parent ? parent.id : null}
      sx={{ flexGrow: 1, overflowY: 'auto', width: '100%', height: '100%' }}
      onNodeSelect={(event, nodeIds, moreinfo) => {
        onSelectedItemChange(event, nodeIds);
      }}
      onNodeToggle={(event, nodeIds) => {
        setExpanded(nodeIds);
      }}
    >
      {parent && !parent.is_disabled && (
      <StyledTreeItem
        icon={showIcon && statusIcon(parent.status)}
        key={parent.id}
        nodeId={parent.id}
        sx={{ backgroundColor: 'background.paper' }}
        label={(
          <Box sx={{ mt: 2, mb: 1 }}>
            <TreeItemTypeChip
              sx={{ mr: 1 }}
              treeitem={parent}
              t={t}
            />
            {parent.name}
            {parent.teams && (
            <AvatarGroup
              spacing='medium'
              sx={{ mt: 1, justifyContent: 'left' }}
              variant='rounded'
              max={5}
            >
              {parent.teams.map((team) => (
                <Avat
                  key={`${parent.id}-${team.id}`}
                  team={team}
                />
              ))}
            </AvatarGroup>
            )}
          </Box>
      )}
      >

        {parent.children.map((objective) => !objective.is_disabled
          && (
          <StyledTreeItem
            icon={showIcon && statusIcon(objective.status)}
            key={objective.id}
            nodeId={objective.id}
            sx={{ backgroundColor: 'background.paper' }}
            label={(
              <Box sx={{ mt: 2, mb: 1 }}>
                <TreeItemTypeChip
                  sx={{ mr: 1 }}
                  treeitem={objective}
                  t={t}
                />
                {objective.name}
                {objective.teams && (
                <AvatarGroup
                  spacing='medium'
                  sx={{ mt: 1, justifyContent: 'left' }}
                  variant='rounded'
                  max={5}
                >
                  {arrayUnique(objective.teams.concat(parent.teams)).map((team) => (
                    <Avat
                      key={`${objective.id}-${team.id}`}
                      team={team}
                    />
                  ))}
                </AvatarGroup>
                )}
              </Box>
          )}
          >
            {objective.children.map((task) => !task.is_disabled && (
            <StyledTreeItem
              icon={showIcon && statusIcon(task.status)}
              key={task.id}
              nodeId={task.id}
              label={(
                <Box sx={{ mt: 2, mb: 1 }}>
                  <TreeItemTypeChip
                    sx={{ mr: 1 }}
                    treeitem={task}
                    t={t}
                  />
                  {task.name}
                  {task.teams && (
                  <AvatarGroup
                    spacing='medium'
                    sx={{ mt: 1, justifyContent: 'left' }}
                    variant='rounded'
                    max={5}
                  >
                    {arrayUnique(task.teams.concat(objective.teams).concat(parent.teams)).map((team) => (
                      <Avat
                        key={`${task.id}-${team.id}`}
                        team={team}
                      />
                    ))}
                  </AvatarGroup>
                  )}
                </Box>
              )}
            />
            ))}
          </StyledTreeItem>
          ))}
      </StyledTreeItem>
      )}
    </TreeView>
  );
};

export default StyledTree;
