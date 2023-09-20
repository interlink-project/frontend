import { Grid, Skeleton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import ProcessPhaseTabs from 'components/dashboard/tree/ProcessPhaseTabs';
import useDependantTranslation from 'hooks/useDependantTranslation';
import useSettings from 'hooks/useSettings';
import $ from 'jquery';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import Gantt from './FrappeGantt';
import './FrappeGantt.css';

const setNewGantt = (id, props, tasks, darkMode, onClick) => {
  document.getElementById('gantt').innerHTML = '';
  if (tasks.length > 0) {
    new Gantt(id, tasks, props);

    if (darkMode) {
      $('.gantt .grid-header').css('fill', '#293142');
      $('.gantt .grid-row').css('fill', '#1c2531');
      $('.gantt .grid-row:nth-child(even)').css('fill', '#293142');
      $('.gantt .tick').css('stroke', '#606060');
      $('.gantt .upper-text').css('fill', 'white');
      $('.gantt .lower-text').css('fill', 'white');
    }

    $('.gantt-phase').each(function (index1) {
      const id = $(this).attr('data-id');
      $(this).on('click', () => {
        onClick(id, 'phase');
      });
    });

    $('.gantt-objective').each(function (index1) {
      const id = $(this).attr('data-id');
      $(this).on('click', () => {
        onClick(id, 'objective');
      });
    });

    $('.gantt-task').each(function (index1) {
      const id = $(this).attr('data-id');
      $(this).on('click', () => {
        onClick(id, 'task');
      });
    });
  } else {
    console.log('NO TASKS');
  }
};

const Workplan = ({ setSelectedTreeItem }) => {
  const { settings } = useSettings();
  const [viewMode, setViewMode] = useState('Week');
  const { process, tree, hasSchema, treeitems, updating, selectedPhaseTab, selectedTreeItem } = useSelector((state) => state.process);
  const navigate = useNavigate();

  if (!hasSchema) {
    navigate(`/dashboard/coproductionprocesses/${process.id}`)
    return null
  }

  const { t } = useDependantTranslation();

  const view_modes = { Day: t('Day'), Week: t('Week'), Month: t('Month'), Year: t('Year') };

  const getClasses = (element) => {
    let classes = '';
    if (element.status === 'in_progress') {
      classes += ' in_progress';
    }
    if (element.status === 'finished') {
      classes += ' finished';
    }
    if (element.status === 'awaiting') {
      classes += ' awaiting';
    }
    if (element.start_date) {
      classes += ' timed';
    }
    if (element && selectedTreeItem && element.id === selectedTreeItem.id) {
      classes += ' blink';
      setTimeout(() => {
        $(`[data-id="${element.id}"]`).removeClass('blink');
      }, 1000);
    }
    return classes;
  };

  const getTasks = () => {
    const final = [];

    if (selectedPhaseTab) {

      if(!selectedPhaseTab.is_disabled){
      final.push({
        id: selectedPhaseTab.id,
        name: selectedPhaseTab.name,
        start: selectedPhaseTab.start_date,
        end: selectedPhaseTab.end_date,
        // progress: phase.progress,
        type: 'phase',
        custom_class: `gantt-phase${getClasses(selectedPhaseTab)}`,
        read_only: true
      });
    }

      selectedPhaseTab.children.forEach((objective) => {

        if(objective){


          if (!objective.is_disabled) {
            final.push({
              id: objective.id,
              name: objective.name,
              dependencies: objective.prerequisites_ids && objective.prerequisites_ids.length > 0 ? [...objective.prerequisites_ids] : [objective.phase_id],
              start: objective.start_date || selectedPhaseTab.start_date || null,
              end: objective.end_date,
              type: 'objective',
              // progress: objective.progress,
              custom_class: `gantt-objective${getClasses(objective)}`,
              read_only: true
            });
          }
    
            objective.children.forEach((task) => {
              
              if(task){
              if(!task.is_disabled){
              final.push({
                id: task.id,
                name: task.name,
                dependencies: task.prerequisites_ids && task.prerequisites_ids.length > 0 ? [...task.prerequisites_ids] : [task.objective_id],
                start: task.start_date || objective.start_date || selectedPhaseTab.start_date || null,
                end: task.end_date,
                type: 'task',
    
                custom_class: `gantt-task${getClasses(task)}`,
                // read_only: true
              });
            }
          }
            });


        }
        
      });
    }

    return final;
    // .sort((a, b) => a.start_date < b.start_date)
  };

  function stopEvent(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  useEffect(() => {
    if (updating) {
      return;
    }
    const id = '#gantt';
    const props = {
      header_height: 50,
      column_width: 30,
      step: 24,
      view_modes: Object.keys(view_modes),
      bar_height: 25,
      bar_corner_radius: 3,
      arrow_curve: 10,
      padding: 22,
      view_mode: viewMode,
      date_format: 'YYYY-MM-DD',
      custom_popup_html: null,
    };
    const readOnly = true;
    if (readOnly) {
      props.on_view_change = function () {
        const bars = document.querySelectorAll(`${id} .bar-group`);
        for (var i = 0; i < bars.length; i++) {
          bars[i].addEventListener('mousedown', stopEvent, true);
        }
        const handles = document.querySelectorAll(`${id} .handle-group`);
        for (var i = 0; i < handles.length; i++) {
          handles[i].remove();
        }
      };
    }
    setNewGantt(id, props, getTasks(), settings.theme === 'DARK', (id, type) => {
      setSelectedTreeItem(treeitems.find((el) => el.id === id), () => navigate(`/dashboard/coproductionprocesses/${process.id}/guide`));
    });
  }, [viewMode, selectedPhaseTab, updating, tree, setNewGantt]);

  return (
    <Grid
      container
      style={{ overflow: 'hidden' }}
    >
      <Grid
        item
        xs={12}
      >
      {selectedPhaseTab && 
        <ProcessPhaseTabs
          t={t}
          selectedId={selectedPhaseTab.id}
          phases={tree}
          onSelect={(value) => {
            const treeitem = treeitems.find((el) => el.id === value);
            setSelectedTreeItem(treeitem);
          }}
        />
      }
        <ToggleButtonGroup
          color='primary'
          value={viewMode}
          fullWidth
          exclusive
          sx={{ backgroundColor: 'background.paper' }}
          onChange={(event, view_mode) => view_mode && view_mode !== viewMode && setViewMode(view_mode)}
        >
          {Object.keys(view_modes).map((el, i) => (
            <ToggleButton
              key={`separatorButton${el}`}
              value={el}
            >
              {view_modes[el]}
            </ToggleButton>
          ))}

        </ToggleButtonGroup>
      </Grid>
      <Grid
        item
        xs={12}
      >
        {updating ? (
          <Skeleton
            variant='rectangular'
            width='100%'
            height='70vh'
          />
        ) : (
          <div
            style={{ alignItems: 'start', height: '100%' }}
            id='gantt'
          />
        )}
      </Grid>
    </Grid>
  );
};

export default Workplan;
