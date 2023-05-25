

export function updateSaveTempDatos(datos = [], model, id, model_name,  parameters) {
    const index = datos.findIndex(
      (item) => item.model === model && item.id === id
    );

    if (index === -1) {
      // Object not found, add new object to array
      const newDatos = [
        ...datos,
        {
          model: model,
          model_name:model_name,
          id: id,
          parameters: parameters,
        },
      ];
      return newDatos;
    } else {
      // Object found, update parameters property
      const newDatos = [...datos];
      newDatos[index] = {
        ...newDatos[index],
        parameters: {
          ...newDatos[index].parameters,
          ...parameters,
        },
      };
      return newDatos;
    }
  }
