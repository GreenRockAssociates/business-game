--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Debian 15.1-1.pgdg110+1)
-- Dumped by pg_dump version 15.1 (Debian 15.1-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: asset_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_entity (
    ticker character varying(5) NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(2000) NOT NULL,
    logo character varying(200) NOT NULL
);


ALTER TABLE public.asset_entity OWNER TO postgres;

--
-- Name: asset_entity_news_report_entries_news_report_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_entity_news_report_entries_news_report_entity (
    "assetEntityTicker" character varying(5) NOT NULL,
    "newsReportEntityId" uuid NOT NULL,
    "newsReportEntityGeneratedTick" integer NOT NULL
);


ALTER TABLE public.asset_entity_news_report_entries_news_report_entity OWNER TO postgres;

--
-- Name: asset_entity_sectors_sector_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_entity_sectors_sector_entity (
    "assetEntityTicker" character varying(5) NOT NULL,
    "sectorEntityName" character varying(255) NOT NULL
);


ALTER TABLE public.asset_entity_sectors_sector_entity OWNER TO postgres;

--
-- Name: asset_health_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_health_entity (
    "generatedTick" integer NOT NULL,
    "gameId" uuid NOT NULL,
    "assetTicker" character varying NOT NULL,
    "assetRating" character varying NOT NULL
);


ALTER TABLE public.asset_health_entity OWNER TO postgres;

--
-- Name: game_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.game_entity (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "gameState" integer NOT NULL
);


ALTER TABLE public.game_entity OWNER TO postgres;

--
-- Name: market_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.market_entity (
    tick integer NOT NULL,
    "gameId" uuid NOT NULL,
    "assetTicker" character varying NOT NULL,
    value numeric(20,2) NOT NULL,
    tradable boolean NOT NULL
);


ALTER TABLE public.market_entity OWNER TO postgres;

--
-- Name: news_report_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.news_report_entity (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "generatedTick" integer NOT NULL,
    title character varying(200) NOT NULL,
    content character varying(10000) NOT NULL,
    "influenceFactor" integer NOT NULL,
    "gameId" uuid
);


ALTER TABLE public.news_report_entity OWNER TO postgres;

--
-- Name: player_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.player_entity (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "bankAccount" numeric(20,2) NOT NULL,
    "gameId" uuid
);


ALTER TABLE public.player_entity OWNER TO postgres;

--
-- Name: portfolio_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.portfolio_entity (
    "assetTicker" character varying NOT NULL,
    "playerId" uuid NOT NULL,
    count numeric(20,2) NOT NULL
);


ALTER TABLE public.portfolio_entity OWNER TO postgres;

--
-- Name: sector_entity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sector_entity (
    name character varying(255) NOT NULL
);


ALTER TABLE public.sector_entity OWNER TO postgres;

--
-- Data for Name: asset_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_entity (ticker, name, description, logo) FROM stdin;
PEA	Pear	Not Apple	pear.png
MGS	Megasoft	Megasoft is an American technology company founded in 1975. It is known for its Doors operating system, its Megasoft Office suite, as well as for its activities in the field of cloud computing and web services.	megasoft.png
BLN	Billions	Billions is an American technology company founded in 1998. It is best known for its Billions search engine, as well as online services such as Bmail, Billions Maps and Billions Drive. Billions is also a major player in the mobile operating system space with Android, as well as in the cloud computing space with Billions Cloud.	billion.png
MSS	Mississipi	Mississippi is an American e-commerce company founded in 1994. It has become one of the largest online retailers in the world, selling a wide range of products from books and music to electronics and household products. Mississippi is also a major player in cloud computing with Mississippi Web Services (MWS) and offers video streaming services with Mississippi Prime Video.	mississipi.png
ONL	Oniel	Oniel is an American fast food company founded in 1940. It has grown into one of the world's largest fast food chains, known for its burgers, fries and affordable menus. Oniel has more than 38,000 restaurants worldwide and serves more than 69 million customers each day.	oniel.png
MEN	Meunier	Meunier is a Swiss food and beverage company founded in 1866 by Frédéric Meunier. Meunier is also a major player in bottled water and baby nutrition. The company employs more than 300,000 people worldwide and operates in over 190 countries. 	meunier.png
NGL	Natglé	Natglé is a French publishing house specialized in comics and graphic novels. Founded in 1969, the company has published many popular comic books in France. Natglé has also expanded its catalog to other genres, such as graphic novels, art books and children's books.	natgle.png
TMT	TMTC	TMTC is a Taiwanese semiconductor manufacturing company founded in 1987. It is one of the world's largest semiconductor foundries, producing chips for customers worldwide. TMTC is also a major player in the research and development of advanced semiconductor technologies, such as 5-nanometer and smaller chips.	tmtc.png
TQS	Turquoise	Turquoise is a French telecommunications company founded in 1988. It is one of the leading telecommunications operators in Europe and worldwide, offering cell phone, internet access and television services. Turquoise is also active in the research and development of advanced technologies, such as 5G and the Internet of Things. The company has over 266 million customers worldwide.	turquoise.png
CFP	CFP	CFP is one of the world's largest banks by assets and offers a range of financial products and services such as retail banking, investment banking, asset management and insurance. CFP is also involved in initiatives related to social and environmental responsibility, such as financing renewable energy and sustainable development projects,	cfp.png
MCB	MCBC	MCBC is a British bank founded in 1865 in Hong Kong and Shanghai. It has become one of the world's largest banks, with operations in more than 65 countries. MCBC offers financial products and services such as retail banking, investment banking, asset management and insurance. The company is also committed to initiatives related to social and environmental responsibility, such as financing renewable energy projects and combating money laundering and financial fraud	mcbc.png
DRG	Diargent	Diargent is a French fashion company founded in 1946. It is known for its haute couture clothing, luxury perfumes and beauty products. Diargent is one of the most iconic brands in French fashion, and is also active in initiatives related to social and environmental responsibility, such as reducing its carbon footprint and promoting gender equality in the fashion industry.	diargent.png
BRM	Bernin Moteur	Bernin Moteur is a French car manufacturing company founded in 1899. It is one of the world's leading automotive manufacturers, offering a range of cars, vans and trucks. Bernin Moteur is also engaged in the research and development of advanced automotive technologies, such as electric vehicles and autonomous driving systems.	bernin.png
JMA	James Automobils	James Automobils is an American automotive manufacturing company founded in 1903. It is one of the world's largest automakers, offering a range of cars, trucks and commercial vehicles. James Automobils is also engaged in the research and development of advanced automotive technologies, such as autonomous driving systems.	james.png
OMC	Otomo Motor Company	Otomo Motor Company is a Japanese automobile manufacturing company founded in 1933. It is one of the world's leading automakers, offering a range of cars, trucks and commercial vehicles. Otomo Motor Company is also involved in the research and development of advanced automotive technologies, such as electric vehicles.	otomo.png
MRG	Marine Group	Marine Group is a French company specialized in the construction of warships and submarines. It designs and builds ships for the French and foreign navies, as well as for private sector clients. The company is also involved in the research and development of advanced technologies, such as nuclear propulsion systems and autonomous ships.	marine.png
DVD	David SA	David SA is a French construction materials company, founded in 1833. It specializes in the production of cement, ready-mixed concrete, aggregates, etc. David SA is one of the world's leading producers of building materials	david.png
ARB	Aerobus	Aerobus is a European aircraft manufacturing company, founded in 1969. It is one of the world's largest aircraft manufacturers, offering a range of models for commercial airlines, armed forces and government agencies.	aerobus.png
DPA	Depaix Aviation	Depaix Aviation is a French company specializing in aircraft manufacturing and software production. It was founded in 1929 and is known for its fighter aircraft, business jets and military drones. Depaix Aviation is also involved in the production of computer-aided design software and geographic information systems.	depaix.png
CAC	Chicago Airplane Company	Chicago Airplane Company is an American aircraft and space manufacturing company, founded in 1916. It is one of the world's largest aircraft manufacturers, offering a range of models for commercial airlines, the military and government agencies.The company is also active in the space industry, producing satellites and rocket launch systems.	chicago.png
SOM	Somme	Somme is a French oil and gas company, founded in 1924. It is one of the five largest integrated oil companies in the world and is active in all stages of the energy value chain, from exploration and production to distribution and marketing.	somme.png
CQL	Coquille	Coquille is a Dutch-British oil and gas company, founded in 1907. It is one of the five largest integrated oil companies in the world and is active in all stages of the energy value chain, from exploration and production to distribution and marketing.	coquille.png
EDS	Edisson	Edisson is an American electric vehicle and clean technology company founded in 2003. It is known for its high-end electric cars, as well as its technological innovations, including large-scale energy storage and solar power generation.	edisson.png
CET	Cosmos Exploration Technolgies	Cosmos Exploration Technolgies is an American space technology company founded in 2002. It is known for its rocket launches and resupply missions to the International Space Station. SpaceX is also involved in developing technologies for space travel, including transporting people to the Moon and Mars.	cosmos.png
PTH	Pythagore	Pythagoras is a French technology company specializing in defense, aerospace, security and information technology, founded in 2000. It is involved in the design and manufacture of complex electronic systems for governments, armed forces and private sector companies.	pythagore.png
LPL	Laplaine	Laplaine is a French fashion company founded in 1933 by the famous tennis player René Lacoste. It is known for its iconic crocodile polo shirt, as well as for its clothing, shoes, perfumes and fashion accessories for men, women and children. 	laplaine.png
CRO	Croisement	Croisement is a  retail company. It is one of the largest retailers in the world, with more than 12,300 stores in over 30 countries. Carrefour sells a wide range of products, including food, electronics, fashion, beauty, and financial and travel services.	Croisement.png
ATOM	Atome	Alstom is a company specializing in the design and manufacture of railway rolling stock and transportation systems. It is involved in the production of high-speed trains, metros, tramways, as well as in the design and implementation of signalling and maintenance systems.	Atome.png
CAP	CapBreton	Capgemini is a French IT services and management consulting company founded in 1967. It provides technology solutions for companies in various sectors, including banking and finance, healthcare, telecommunications, energy and industry. Capgemini is also involved in digital transformation and innovation projects, such as Artificial Intelligence, blockchain and cloud computing.	CapBreton.png
DAN	Dana	Dana is a food company specialized in the production of fresh dairy products, beverages and baby food. 	Dana.png
ANG	Angie	Engie is an energy company specialized in the production, distribution and supply of energy, including natural gas and electricity.	Angie.png
FIN	Finaso	Finaso is a French pharmaceutical company. It specializes in the research, development, manufacture and marketing of drugs, particularly in the fields of human and animal health. Sanofi is involved in the production of drugs for the treatment of diseases such as diabetes, multiple sclerosis, influenza, cancer and cardiovascular diseases.	Finaso.png
STE	Stellaris	Stellaris is a multinational company of French and Italian origin, specialized in the production of cars and commercial vehicles. Created in 2021 by the merger of two major car manufacturers, Stellantis now owns a range of prestigious car brands.	Stellaris.png
LEO	Léonard	Léonard is a company specialized in construction, engineering and related services. It is present in many sectors such as road and rail infrastructures, construction, energy, telecommunications and public services.	Léonard.png
VIV	Vivaldi	Vivaldi is a media and communications conglomerate. The company has evolved over time to become a media and entertainment giant. Vivaldi owns companies in various fields, such as television, film, music, video games, telecommunications and publishing.	Vivaldi.png
FRS	France Scientifics	France Scientifics is a global biotechnology company providing laboratory analysis and testing services for the food, pharmaceutical, environmental and medical diagnostic industries. Eurofins Scientific is one of the world leaders in its field and offers a wide range of testing and analytical services to meet the needs of its customers.	France_Scientifics.png
EXE	EXE	EXE is a multinational insurance and asset management company. EXE has grown into one of the world's largest insurance groups, offering a range of life, health, auto, home insurance and asset management products and services.  The company is committed to meeting the needs of its customers, promoting sustainability and acting responsibly towards society and the environment.	EXE.png
GAZ	Gaz Liquide	GAZ Liquide is a company specialized in the production and distribution of industrial, medical and specialty gases, as well as related services.  GAZ Liquide supplies gases for a variety of industrial applications, such as metallurgy, petrochemicals, electronics and automotive manufacturing, as well as for medical and food applications. 	Gaz_Liquide.png
LEP	Lepetit	Lepetit is a French company specialized in the production and distribution of electrical and digital equipment for residential, commercial and industrial electrical installations. Lepetit offers a wide range of products, including switches, sockets, electrical panels, cables and wiring accessories, as well as digital solutions for the smart home. 	Lepetit.png
GER	Gérard Pastis	Gérard Pastis is a company specializing in the production and distribution of alcoholic beverages, including spirits such as whisky, vodka, gin and rum, as well as wines and champagnes. Gérard Pastis owns iconic brands.	Gérard_Pastis.png
\.


--
-- Data for Name: asset_entity_news_report_entries_news_report_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_entity_news_report_entries_news_report_entity ("assetEntityTicker", "newsReportEntityId", "newsReportEntityGeneratedTick") FROM stdin;
\.


--
-- Data for Name: asset_entity_sectors_sector_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_entity_sectors_sector_entity ("assetEntityTicker", "sectorEntityName") FROM stdin;
PEA	Technology
PEA	Digital services
MGS	Technology
MGS	Digital services
BLN	Technology
BLN	Digital services
MSS	Technology
MSS	Digital services
MSS	Logistics
MSS	Distribution
ONL	Food
MEN	Agriculture
NGL	Edition
TMT	Technology
TMT	Electronics
TQS	Telecoms
TQS	Digital services
CFP	Banking
MCB	Banking
DRG	Luxury
DRG	Mode
BRM	Automobile
JMA	Automobile
OMC	Automobile
MRG	Freight
MRG	Military
DVD	Construction
DVD	Materials
ARB	Aeronautics
DPA	Aeronautics
DPA	Military
CAC	Aeronautics
CAC	Military
SOM	Chemicals
SOM	Resources
CQL	Chemicals
CQL	Resources
EDS	Automobile
EDS	Digital services
CET	Technology
CET	Aerospace
PTH	Technology
PTH	Aerospace
PTH	Military
PTH	Electronics
LPL	Mode
LPL	Textile
CRO	Distribution
ATOM	Logistics
CAP	Digital services
DAN	Agriculture
ANG	Energy
FIN	Healthcare
FIN	Chemicals
STE	Automobile
LEO	Real estate
LEO	Construction
VIV	Media
VIV	Entertainment
FRS	Technology
EXE	Insurance
EXE	Finance
GAZ	Resources
LEP	Electronics
GER	Agriculture
\.


--
-- Data for Name: asset_health_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_health_entity ("generatedTick", "gameId", "assetTicker", "assetRating") FROM stdin;
\.


--
-- Data for Name: game_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.game_entity (id, "gameState") FROM stdin;
\.


--
-- Data for Name: market_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.market_entity (tick, "gameId", "assetTicker", value, tradable) FROM stdin;
\.


--
-- Data for Name: news_report_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.news_report_entity (id, "generatedTick", title, content, "influenceFactor", "gameId") FROM stdin;
\.


--
-- Data for Name: player_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.player_entity (id, "bankAccount", "gameId") FROM stdin;
\.


--
-- Data for Name: portfolio_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.portfolio_entity ("assetTicker", "playerId", count) FROM stdin;
\.


--
-- Data for Name: sector_entity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sector_entity (name) FROM stdin;
Technology
Digital services
Agriculture
Chemicals
Entertainment
Media
Banking
Edition
Distribution
Construction
Logistics
Automobile
Healthcare
Aeronautics
Resources
Textile
Food
Telecoms
Luxury
Mode
Freight
Military
Materials
Aerospace
Electronics
Energy
Real estate
Insurance
Finance
\.


--
-- Name: asset_entity_sectors_sector_entity PK_212e653c4318008ce5a248ce522; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_entity_sectors_sector_entity
    ADD CONSTRAINT "PK_212e653c4318008ce5a248ce522" PRIMARY KEY ("assetEntityTicker", "sectorEntityName");


--
-- Name: asset_health_entity PK_6a943b8a6d44145264873458134; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_health_entity
    ADD CONSTRAINT "PK_6a943b8a6d44145264873458134" PRIMARY KEY ("generatedTick", "gameId", "assetTicker");


--
-- Name: sector_entity PK_75b8986cc91739cb6aa8eda465f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sector_entity
    ADD CONSTRAINT "PK_75b8986cc91739cb6aa8eda465f" PRIMARY KEY (name);


--
-- Name: asset_entity PK_91344b9f36ad771507140461583; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_entity
    ADD CONSTRAINT "PK_91344b9f36ad771507140461583" PRIMARY KEY (ticker);


--
-- Name: asset_entity_news_report_entries_news_report_entity PK_c81c9ca2fa25346d122d723a8cd; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_entity_news_report_entries_news_report_entity
    ADD CONSTRAINT "PK_c81c9ca2fa25346d122d723a8cd" PRIMARY KEY ("assetEntityTicker", "newsReportEntityId", "newsReportEntityGeneratedTick");


--
-- Name: player_entity PK_db4a0b692e54fd8ee0247f40d0d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player_entity
    ADD CONSTRAINT "PK_db4a0b692e54fd8ee0247f40d0d" PRIMARY KEY (id);


--
-- Name: portfolio_entity PK_de5534e6c72c4079956394dd90b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_entity
    ADD CONSTRAINT "PK_de5534e6c72c4079956394dd90b" PRIMARY KEY ("assetTicker", "playerId");


--
-- Name: market_entity PK_eac870a262c7d8ad17bbf87be72; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.market_entity
    ADD CONSTRAINT "PK_eac870a262c7d8ad17bbf87be72" PRIMARY KEY (tick, "gameId", "assetTicker");


--
-- Name: game_entity PK_f9f8d5bc97d6a9fcb2058fbdfef; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_entity
    ADD CONSTRAINT "PK_f9f8d5bc97d6a9fcb2058fbdfef" PRIMARY KEY (id);


--
-- Name: news_report_entity PK_fd776c2272bc3630508c8161850; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news_report_entity
    ADD CONSTRAINT "PK_fd776c2272bc3630508c8161850" PRIMARY KEY (id, "generatedTick");


--
-- Name: IDX_8378911f17e5421663ec6c448d; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_8378911f17e5421663ec6c448d" ON public.asset_entity_news_report_entries_news_report_entity USING btree ("assetEntityTicker");


--
-- Name: IDX_894a4c1d1f3578d14d630d5891; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_894a4c1d1f3578d14d630d5891" ON public.asset_entity_news_report_entries_news_report_entity USING btree ("newsReportEntityId", "newsReportEntityGeneratedTick");


--
-- Name: IDX_b2a195f248380594a153efcf17; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_b2a195f248380594a153efcf17" ON public.asset_entity_sectors_sector_entity USING btree ("sectorEntityName");


--
-- Name: IDX_dddae8938c7678d69a8b9e6dbe; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_dddae8938c7678d69a8b9e6dbe" ON public.asset_entity_sectors_sector_entity USING btree ("assetEntityTicker");


--
-- Name: news_report_entity FK_1fbc40a8e4b8597d484d9a87b87; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.news_report_entity
    ADD CONSTRAINT "FK_1fbc40a8e4b8597d484d9a87b87" FOREIGN KEY ("gameId") REFERENCES public.game_entity(id);


--
-- Name: asset_entity_news_report_entries_news_report_entity FK_8378911f17e5421663ec6c448d8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_entity_news_report_entries_news_report_entity
    ADD CONSTRAINT "FK_8378911f17e5421663ec6c448d8" FOREIGN KEY ("assetEntityTicker") REFERENCES public.asset_entity(ticker) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: asset_entity_news_report_entries_news_report_entity FK_894a4c1d1f3578d14d630d5891e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_entity_news_report_entries_news_report_entity
    ADD CONSTRAINT "FK_894a4c1d1f3578d14d630d5891e" FOREIGN KEY ("newsReportEntityId", "newsReportEntityGeneratedTick") REFERENCES public.news_report_entity(id, "generatedTick");


--
-- Name: market_entity FK_89d7a481db61fa93174bd28a6d5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.market_entity
    ADD CONSTRAINT "FK_89d7a481db61fa93174bd28a6d5" FOREIGN KEY ("assetTicker") REFERENCES public.asset_entity(ticker);


--
-- Name: asset_health_entity FK_9cc2f2970c90f139a8c61042f5e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_health_entity
    ADD CONSTRAINT "FK_9cc2f2970c90f139a8c61042f5e" FOREIGN KEY ("assetTicker") REFERENCES public.asset_entity(ticker);


--
-- Name: asset_entity_sectors_sector_entity FK_b2a195f248380594a153efcf171; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_entity_sectors_sector_entity
    ADD CONSTRAINT "FK_b2a195f248380594a153efcf171" FOREIGN KEY ("sectorEntityName") REFERENCES public.sector_entity(name);


--
-- Name: player_entity FK_bbffcbf3ee2befca4f4c991c3d2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.player_entity
    ADD CONSTRAINT "FK_bbffcbf3ee2befca4f4c991c3d2" FOREIGN KEY ("gameId") REFERENCES public.game_entity(id);


--
-- Name: portfolio_entity FK_c5e7cc57bba326eedd63e391b3a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_entity
    ADD CONSTRAINT "FK_c5e7cc57bba326eedd63e391b3a" FOREIGN KEY ("assetTicker") REFERENCES public.asset_entity(ticker);


--
-- Name: asset_health_entity FK_d9e9cdeef25d0a3617c95a288e5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_health_entity
    ADD CONSTRAINT "FK_d9e9cdeef25d0a3617c95a288e5" FOREIGN KEY ("gameId") REFERENCES public.game_entity(id);


--
-- Name: asset_entity_sectors_sector_entity FK_dddae8938c7678d69a8b9e6dbef; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_entity_sectors_sector_entity
    ADD CONSTRAINT "FK_dddae8938c7678d69a8b9e6dbef" FOREIGN KEY ("assetEntityTicker") REFERENCES public.asset_entity(ticker) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: market_entity FK_ea73b75f12c699a5c832e8ef9d6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.market_entity
    ADD CONSTRAINT "FK_ea73b75f12c699a5c832e8ef9d6" FOREIGN KEY ("gameId") REFERENCES public.game_entity(id);


--
-- Name: portfolio_entity FK_ebfefb14435ebbe0ad48140950b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_entity
    ADD CONSTRAINT "FK_ebfefb14435ebbe0ad48140950b" FOREIGN KEY ("playerId") REFERENCES public.player_entity(id);


--
-- PostgreSQL database dump complete
--

