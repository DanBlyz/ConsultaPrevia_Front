import { Action, createReducer, on } from '@ngrx/store';

import { CorrespondenciaState } from '.';
import * as CorrespondenciaAcciones from './acciones';

export const correspondenciaInicial: CorrespondenciaState = {
  listaTipoDocumento: {
    filtro: null,
    paginado: null,
    lista: []
  },
  tipoDocumento: null,

  listaContacto: {
    filtro: null,
    paginado: null,
    lista: []
  },
  contacto: null,

  listaClasificacion: {
    lista: []
  },
  clasificacion: null,

  listaBuzon: {
    filtro: null,
    paginado: null,
    lista: []
  },
  buzon: null,

  listaDocumento: {
    filtro: null,
    paginado: null,
    lista: []
  },
  documento: null,
  contenido: null,

  listaBuzonUsuario: {
    paginado: null,
    lista: []
  },
  buzonUsuario: null,

  listaHojaRuta: {
    filtro: null,
    paginado: null,
    lista: []
  },
  hojaRuta: null,

  listaPlantilla: {
    filtro: null,
    paginado: null,
    lista: []
  },
  plantilla: null,

  listaParametro: {
    filtro: null,
    paginado: null,
    lista: []
  },
  parametro: null,

  listaSeguimiento: {
    filtro: null,
    paginado: null,
    lista: []
  },
  seguimiento: null,

  listaGrupo: {
    filtro: null,
    paginado: null,
    lista: []
  },
  grupo: null,

  listaGrupoBuzon: {
    paginado: null,
    lista: []
  },
  grupoBuzon: null,

  listaDocumentoHojaRuta: {
    filtro: null,
    paginado: null,
    lista: []
  },
  documentoHojaRuta: null,

  listaRol: {
    filtro: null,
    paginado: null,
    lista: []
  },
  rol: null,

  listaUsuario: {
    filtro: null,
    paginado: null,
    lista: []
  },
  usuario: null,

  listaCuenta: {
    filtro: null,
    paginado: null,
    lista: []
  },
  cuenta: null,

  listaTramite: {
    filtro: null,
    paginado: null,
    lista: []
  },
  tramite: null,

  listaProvidencia: {
    filtro: null,
    paginado: null,
    lista: []
  },
  providencia: null,

  listaNotificacion: {
    filtro: null,
    paginado: null,
    lista: []
  },
  notificacion: null,

  listaActoAdministrativo: {
    filtro: null,
    paginado: null,
    lista: []
  },
  actoAdministrativo: null
};

const correspondenciaReducer = createReducer(
  correspondenciaInicial,
  //TipoDocumento
  on(
    CorrespondenciaAcciones.establecerFiltroTipoDocumento,
    (state, { filtro }) => {
      return {
        ...state,
        listaTipoDocumento: {
          ...state.listaTipoDocumento,
          filtro: { ...filtro }
        },
        tipoDocumento: null
      };
    }
  ),
  on(
    CorrespondenciaAcciones.establecerListaTipoDocumento,
    (state, { lista, paginado }) => {
      return {
        ...state,
        listaTipoDocumento: {
          ...state.listaTipoDocumento,
          lista: [...lista],
          paginado: { ...paginado }
        },
        tipoDocumento: null
      };
    }
  ),
  on(CorrespondenciaAcciones.establecerTipoDocumento, (state, { objeto }) => {
    return {
      ...state,
      tipoDocumento: { ...objeto }
    };
  }),
  //Contacto
  on(CorrespondenciaAcciones.establecerFiltroContacto, (state, { filtro }) => {
    return {
      ...state,
      listaContacto: {
        ...state.listaContacto,
        filtro: { ...filtro }
      },
      contacto: null
    };
  }),
  on(
    CorrespondenciaAcciones.establecerListaContacto,
    (state, { lista, paginado }) => {
      return {
        ...state,
        listaContacto: {
          ...state.listaContacto,
          lista: [...lista],
          paginado: { ...paginado }
        },
        contacto: null
      };
    }
  ),
  on(CorrespondenciaAcciones.establecerContacto, (state, { objeto }) => {
    return {
      ...state,
      contacto: { ...objeto }
    };
  }),
  // Clasificacion
  on(
    CorrespondenciaAcciones.establecerListaClasificacion,
    (state, { lista }) => ({
      ...state,
      listaClasificacion: {
        ...state.listaClasificacion,
        lista: [...lista]
      },
      clasificacion: null
    })
  ),
  on(CorrespondenciaAcciones.establecerClasificacion, (state, { objeto }) => {
    return {
      ...state,
      clasificacion: { ...objeto }
    };
  }),
  // Buzon
  on(CorrespondenciaAcciones.establecerFiltroBuzon, (state, { filtro }) => {
    return {
      ...state,
      listaBuzon: {
        ...state.listaBuzon,
        filtro: { ...filtro }
      },
      buzon: null
    };
  }),
  on(
    CorrespondenciaAcciones.establecerListaBuzon,
    (state, { lista, paginado }) => {
      return {
        ...state,
        listaBuzon: {
          ...state.listaBuzon,
          lista: [...lista],
          paginado: { ...paginado }
        },
        buzon: null
      };
    }
  ),
  on(CorrespondenciaAcciones.establecerBuzon, (state, { objeto }) => {
    return {
      ...state,
      buzon: { ...objeto }
    };
  }),
  // BuzonUsuario
  on(
    CorrespondenciaAcciones.establecerListaBuzonUsuario,
    (state, { lista, paginado }) => {
      return {
        ...state,
        listaBuzonUsuario: {
          ...state.listaBuzonUsuario,
          lista: [...lista],
          paginado: { ...paginado }
        },
        buzonUsuario: null
      };
    }
  ),
  on(CorrespondenciaAcciones.establecerBuzonUsuario, (state, { objeto }) => {
    return {
      ...state,
      buzonUsuario: { ...objeto }
    };
  }),
  // Documento
  on(CorrespondenciaAcciones.establecerFiltroDocumento, (state, { filtro }) => {
    return {
      ...state,
      listaDocumento: {
        ...state.listaDocumento,
        filtro: { ...filtro }
      },
      documento: null
    };
  }),
  on(
    CorrespondenciaAcciones.establecerListaDocumento,
    (state, { lista, paginado }) => {
      return {
        ...state,
        listaDocumento: {
          ...state.listaDocumento,
          lista: [...lista],
          paginado: { ...paginado }
        },
        documento: null
      };
    }
  ),
  on(CorrespondenciaAcciones.establecerDocumento, (state, { objeto }) => {
    return {
      ...state,
      documento: { ...objeto }
    };
  }),
  // Plantilla
  on(CorrespondenciaAcciones.establecerFiltroPlantilla, (state, { filtro }) => {
    return {
      ...state,
      listaPlantilla: {
        ...state.listaPlantilla,
        filtro: { ...filtro }
      },
      plantilla: null
    };
  }),
  on(
    CorrespondenciaAcciones.establecerListaPlantilla,
    (state, { lista, paginado }) => {
      return {
        ...state,
        listaPlantilla: {
          ...state.listaPlantilla,
          lista: [...lista],
          paginado: { ...paginado }
        },
        plantilla: null
      };
    }
  ),
  on(CorrespondenciaAcciones.establecerPlantilla, (state, { objeto }) => {
    return {
      ...state,
      plantilla: { ...objeto }
    };
  }),
  // Contenido
  on(CorrespondenciaAcciones.establecerContenido, (state, { objeto }) => {
    return {
      ...state,
      contenido: { ...objeto }
    };
  }),
  // Parametro
  on(CorrespondenciaAcciones.establecerFiltroParametro, (state, { filtro }) => {
    return {
      ...state,
      listaParametro: {
        ...state.listaParametro,
        filtro: { ...filtro }
      },
      parametro: null
    };
  }),
  on(
    CorrespondenciaAcciones.establecerListaParametro,
    (state, { lista, paginado }) => {
      return {
        ...state,
        listaParametro: {
          ...state.listaParametro,
          lista: [...lista],
          paginado: { ...paginado }
        },
        parametro: null
      };
    }
  ),
  on(CorrespondenciaAcciones.establecerParametro, (state, { objeto }) => {
    return {
      ...state,
      parametro: { ...objeto }
    };
  }),
  //HojaRuta
  on(CorrespondenciaAcciones.establecerFiltroHojaRuta, (state, { filtro }) => {
    return {
      ...state,
      listaHojaRuta: {
        ...state.listaHojaRuta,
        filtro: { ...filtro }
      },
      hojaRuta: null
    };
  }),
  on(
    CorrespondenciaAcciones.establecerListaHojaRuta,
    (state, { lista, paginado }) => {
      return {
        ...state,
        listaHojaRuta: {
          ...state.listaHojaRuta,
          lista: [...lista],
          paginado: { ...paginado }
        },
        hojaRuta: null
      };
    }
  ),
  on(CorrespondenciaAcciones.establecerHojaRuta, (state, { objeto }) => {
    return {
      ...state,
      hojaRuta: { ...objeto }
    };
  }),
  //Seguimiento
  on(
    CorrespondenciaAcciones.establecerFiltroSeguimiento,
    (state, { filtro }) => {
      return {
        ...state,
        listaSeguimiento: {
          ...state.listaSeguimiento,
          filtro: { ...filtro }
        },
        seguimiento: null
      };
    }
  ),
  on(
    CorrespondenciaAcciones.establecerListaSeguimiento,
    (state, { lista, paginado }) => {
      return {
        ...state,
        listaSeguimiento: {
          ...state.listaSeguimiento,
          lista: [...lista],
          paginado: { ...paginado }
        },
        seguimiento: null
      };
    }
  ),
  on(CorrespondenciaAcciones.establecerSeguimiento, (state, { objeto }) => {
    return {
      ...state,
      seguimiento: { ...objeto }
    };
  }),
  // Grupo
  on(CorrespondenciaAcciones.establecerFiltroGrupo, (state, { filtro }) => {
    return {
      ...state,
      listaGrupo: {
        ...state.listaGrupo,
        filtro: { ...filtro }
      },
      grupo: null
    };
  }),
  on(
    CorrespondenciaAcciones.establecerListaGrupo,
    (state, { lista, paginado }) => {
      return {
        ...state,
        listaGrupo: {
          ...state.listaGrupo,
          lista: [...lista],
          paginado: { ...paginado }
        },
        grupo: null
      };
    }
  ),
  on(CorrespondenciaAcciones.establecerGrupo, (state, { objeto }) => {
    return {
      ...state,
      grupo: { ...objeto }
    };
  }),
  // GrupoBuzon
  on(
    CorrespondenciaAcciones.establecerListaGrupoBuzon,
    (state, { lista, paginado }) => {
      return {
        ...state,
        listaGrupoBuzon: {
          ...state.listaGrupoBuzon,
          lista: [...lista],
          paginado: { ...paginado }
        },
        grupoBuzon: null
      };
    }
  ),
  on(CorrespondenciaAcciones.establecerGrupoBuzon, (state, { objeto }) => {
    return {
      ...state,
      grupoBuzon: { ...objeto }
    };
  }),
  //DocumentoHojaRuta
  on(
    CorrespondenciaAcciones.establecerFiltroDocumentoHojaRuta,
    (state, { filtro }) => {
      return {
        ...state,
        listaDocumentoHojaRuta: {
          ...state.listaDocumentoHojaRuta,
          filtro: { ...filtro }
        },
        documentoHojaRuta: null
      };
    }
  ),
  on(
    CorrespondenciaAcciones.establecerListaDocumentoHojaRuta,
    (state, { lista, paginado }) => {
      return {
        ...state,
        listaDocumentoHojaRuta: {
          ...state.listaDocumentoHojaRuta,
          lista: [...lista],
          paginado: { ...paginado }
        },
        documentoHojaRuta: null
      };
    }
  ),
  on(
    CorrespondenciaAcciones.establecerDocumentoHojaRuta,
    (state, { objeto }) => {
      return {
        ...state,
        documentoHojaRuta: { ...objeto }
      };
    }
  ),
    // Rol
    on(CorrespondenciaAcciones.establecerFiltroRol, (state, { filtro }) => {
      return {
        ...state,
        listaRol: {
          ...state.listaRol,
          filtro: { ...filtro }
        },
        rol: null
      };
    }),
    on(
      CorrespondenciaAcciones.establecerListaRol,
      (state, { lista, paginado }) => {
        return {
          ...state,
          listaRol: {
            ...state.listaRol,
            lista: [...lista],
            paginado: { ...paginado }
          },
          rol: null
        };
      }
    ),
    on(CorrespondenciaAcciones.establecerRol, (state, { objeto }) => {
      return {
        ...state,
        rol: { ...objeto }
      };
    }),
        // Usuario
        on(CorrespondenciaAcciones.establecerFiltroUsuario, (state, { filtro }) => {
          return {
            ...state,
            listaUsuario: {
              ...state.listaUsuario,
              filtro: { ...filtro }
            },
            usuario: null
          };
        }),
        on(
          CorrespondenciaAcciones.establecerListaUsuario,
          (state, { lista, paginado }) => {
            return {
              ...state,
              listaUsuario: {
                ...state.listaUsuario,
                lista: [...lista],
                paginado: { ...paginado }
              },
              usuario: null
            };
          }
        ),
        on(CorrespondenciaAcciones.establecerUsuario, (state, { objeto }) => {
          return {
            ...state,
            usuario: { ...objeto }
          };
        }),
        // Cuenta
        on(CorrespondenciaAcciones.establecerFiltroCuenta, (state, { filtro }) => {
          return {
            ...state,
            listaCuenta: {
              ...state.listaCuenta,
              filtro: { ...filtro }
            },
            cuenta: null
          };
        }),
        on(
          CorrespondenciaAcciones.establecerListaCuenta,
          (state, { lista, paginado }) => {
            return {
              ...state,
              listaCuenta: {
                ...state.listaCuenta,
                lista: [...lista],
                paginado: { ...paginado }
              },
              cuenta: null
            };
          }
        ),
        on(CorrespondenciaAcciones.establecerCuenta, (state, { objeto }) => {
          return {
            ...state,
            cuenta: { ...objeto }
          };
        }),
        //tramite
        on(CorrespondenciaAcciones.establecerFiltroTramite, (state, { filtro }) => {
          return {
            ...state,
            listaTramite: {
              ...state.listaTramite,
              filtro: { ...filtro }
            },
            tramite: null
          };
        }),
        on(
          CorrespondenciaAcciones.establecerListaTramite,
          (state, { lista, paginado }) => {
            return {
              ...state,
              listaTramite: {
                ...state.listaTramite,
                lista: [...lista],
                paginado: { ...paginado }
              },
              tramite: null
            };
          }
        ),
        on(CorrespondenciaAcciones.establecerTramite, (state, { objeto }) => {
          return {
            ...state,
            tramite: { ...objeto }
          };
        }),
        //Providencia
        on(CorrespondenciaAcciones.establecerFiltroProvidencia, (state, { filtro }) => {
          return {
            ...state,
            listaProvidencia: {
              ...state.listaProvidencia,
              filtro: { ...filtro }
            },
            providencia: null
          };
        }),
        on(
          CorrespondenciaAcciones.establecerListaProvidencia,
          (state, { lista, paginado }) => {
            return {
              ...state,
              listaProvidencia: {
                ...state.listaProvidencia,
                lista: [...lista],
                paginado: { ...paginado }
              },
              providencia: null
            };
          }
        ),
        on(CorrespondenciaAcciones.establecerProvidencia, (state, { objeto }) => {
          return {
            ...state,
            providencia: { ...objeto }
          };
        }),
        //notificacion
        on(CorrespondenciaAcciones.establecerFiltroNotificacion, (state, { filtro }) => {
          return {
            ...state,
            listaNotificacion: {
              ...state.listaNotificacion,
              filtro: { ...filtro }
            },
            notificacion: null
          };
        }),
        on(
          CorrespondenciaAcciones.establecerListaNotificacion,
          (state, { lista, paginado }) => {
            return {
              ...state,
              listaNotificacion: {
                ...state.listaNotificacion,
                lista: [...lista],
                paginado: { ...paginado }
              },
              notificacion: null
            };
          }
        ),
        on(CorrespondenciaAcciones.establecerNotificacion, (state, { objeto }) => {
          return {
            ...state,
            notificacion: { ...objeto }
          };
        }),
        //Actos Administrativos
        on(CorrespondenciaAcciones.establecerFiltroActoAdministrativo, (state, { filtro }) => {
          return {
            ...state,
            listaActoAdministrativo: {
              ...state.listaActoAdministrativo,
              filtro: { ...filtro }
            },
            actoAdministrativo: null
          };
        }),
        on(
          CorrespondenciaAcciones.establecerListaActoAdministrativo,
          (state, { lista, paginado }) => {
            return {
              ...state,
              listaActoAdministrativo: {
                ...state.listaActoAdministrativo,
                lista: [...lista],
                paginado: { ...paginado }
              },
              actoAdministrativo: null
            };
          }
        ),
        on(CorrespondenciaAcciones.establecerActoAdministrativo, (state, { objeto }) => {
          return {
            ...state,
            actoAdministrativo: { ...objeto }
          };
        }),

);

export function reducer(
  state: CorrespondenciaState | undefined,
  action: Action
): any {
  return correspondenciaReducer(state, action);
}
