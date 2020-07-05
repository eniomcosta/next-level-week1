import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Link, useHistory } from "react-router-dom";
import { Map, TileLayer, Marker } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";

import "./styles.css";
import logo from "../../assets/logo.svg";

import Item from "../../interfaces/item";
import Uf from "../../interfaces/uf";
import City from "../../interfaces/city";

import { getItems, savePoint } from "../../services/api";
import { getUfs, getCitiesByUf } from "../../services/ibgeApi";

const CreatePoint = () => {
  const history = useHistory();

  const [items, setItems] = useState<Item[]>([]);

  const [ufs, setUfs] = useState<Uf[]>([]);
  const [selectedUf, setSelectedUf] = useState<Uf>({ id: 0, initials: "" });

  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City>({ id: 0, name: "" });

  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
    0,
    0,
  ]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setInitialPosition([latitude, longitude]);
    });

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
    const selectedCity_id = event.target.value;

    const city = cities.filter(
      (city) => city.id === Number(selectedCity_id)
    )[0];

    setSelectedCity(city);
  }

  function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPosition([event.latlng.lat, event.latlng.lng]);
  }

  function handleFormData(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
  }

  function handleSelectedItems(id: number) {
    if (!selectedItems.includes(id)) {
      setSelectedItems([...selectedItems, id]);
    } else {
      const filteredItems = selectedItems.filter((item) => item !== id);

      setSelectedItems(filteredItems);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { name, email, whatsapp } = formData;
    const [latitude, longitude] = selectedPosition;
    const uf = selectedUf.initials;
    const city = selectedCity.name;
    const items = selectedItems;

    const data = {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      uf,
      city,
      items_id: items,
    };

    await savePoint(data);

    alert("Ponto criado!");

    history.push("/");
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

      <form onSubmit={handleSubmit}>
        <h1>Cadastro de Ponto de Coleta</h1>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input type="text" name="name" id="name" onBlur={handleFormData} />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                onBlur={handleFormData}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onBlur={handleFormData}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o enderço no mapa</span>
          </legend>

          <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={selectedPosition} />
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
              <li
                key={item.id}
                onClick={() => handleSelectedItems(item.id)}
                className={selectedItems.includes(item.id) ? "selected" : ""}
              >
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
