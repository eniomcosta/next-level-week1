import axios from "axios";

import Uf from "../interfaces/uf";
import City from "../interfaces/city";

interface IBGEObjUf {
  id: number;
  sigla: string;
}

interface IBGEObjCity {
  id: number;
  nome: string;
}

const api = axios.create({
  baseURL: "https://servicodados.ibge.gov.br/api/v1/localidades/",
});

export const getUfs = () => {
  return api.get("estados").then((res) => {
    const data: Uf[] = res.data.map((obj: IBGEObjUf) => {
      return { id: obj.id, initials: obj.sigla };
    });

    return data.sort(compareUf);
  });
};

export const getCitiesByUf = (uf: string) => {
  return api.get(`estados/${uf}/municipios`).then((res) => {
    const data: City[] = res.data.map((obj: IBGEObjCity) => {
      return { id: obj.id, name: obj.nome };
    });

    return data;
  });
};

function compareUf(a: Uf, b: Uf) {
  if (a.initials < b.initials) {
    return -1;
  }
  if (a.initials > b.initials) {
    return 1;
  }
  return 0;
}
