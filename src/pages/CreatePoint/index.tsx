import React, { useEffect, useState, ChangeEvent } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import { Map, TileLayer, Marker } from "react-leaflet";

import "./styles.css";
import logo from "../../assets/logo.svg";

import Item from "../../interfaces/item";
import Uf from "../../interfaces/uf";
import City from "../../interfaces/city";

import { getItems } from "../../services/api";
import { getUfs, getCitiesByUf } from "../../services/ibgeApi";

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);

  const [ufs, setUfs] = useState<Uf[]>([]);
  const [selectedUf, setSelectedUf] = useState<Uf>({ id: 0, initials: "" });

  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City>({ id: 0, name: "" });

  useEffect(() => {
    getItems().then((res) => {
      setItems(res);
    });

    getUfs().then((res) => {
      setUfs(res);
    });
  }, []);

  useEffect(() => {
    getCitiesByUf(selectedUf.initials).then((res) => {
      setCities(res);
    });
  }, [selectedUf]);

  function handleChangeUf(event: ChangeEvent<HTMLSelectElement>) {
    const selectedUf_id = event.target.value;
    const uf = ufs.filter((uf) => uf.id === Number(selectedUf_id))[0];

    setSelectedUf(uf);
  }

  function handleChangeCity(event: ChangeEvent<HTMLSelectElement>) {
    const selectedCity_id = event.target.id;
    const city = cities.filter(
      (city) => city.id === Number(selectedCity_id)
    )[0];

    setSelectedCity(city);
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />

        <Link to="/">
          <FiArrowLeft />
          Voltar para a home
        </Link>
      </header>

      <form>
        <h1>Cadastro de Ponto de Coleta</h1>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input type="text" name="name" id="name" />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input type="email" name="email" id="email" />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input type="text" name="whatsapp" id="whatsapp" />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o enderço no mapa</span>
          </legend>

          <Map center={[-5.9189113, -35.2258358]} zoom={13}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[-5.9189113, -35.2258358]} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select name="uf" id="uf" onChange={handleChangeUf}>
                <option value="0">Selecione uma UF</option>
                {ufs.map((uf) => (
                  <option key={uf.id} value={uf.id}>
                    {uf.initials}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select name="city" id="city" onChange={handleChangeCity}>
                <option value="0">Selecione uma Cidade</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Itens de Coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>
          <ul className="items-grid">
            {items.map((item) => (
              <li key={item.id}>
                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>
        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  );
};

export default CreatePoint;
