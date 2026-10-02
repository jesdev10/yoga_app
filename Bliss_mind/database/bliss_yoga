--
-- PostgreSQL database dump
--

\restrict EPxYdvVYNUKotHibwhUlBEbafxdS57jKd7PFmPMVXEEdob8s7p2tVCsR3DtxUsB

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

-- Started on 2026-10-02 00:03:33

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 106571)
-- Name: bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookings (
    booking_id bigint NOT NULL,
    user_id bigint NOT NULL,
    session_id bigint NOT NULL,
    booking_datetime timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) DEFAULT 'confirmed'::character varying NOT NULL,
    cancelled_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT bookings_status_check CHECK (((status)::text = ANY ((ARRAY['confirmed'::character varying, 'cancelled'::character varying, 'completed'::character varying, 'no_show'::character varying])::text[])))
);


ALTER TABLE public.bookings OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 106570)
-- Name: bookings_booking_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bookings_booking_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bookings_booking_id_seq OWNER TO postgres;

--
-- TOC entry 4987 (class 0 OID 0)
-- Dependencies: 221
-- Name: bookings_booking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bookings_booking_id_seq OWNED BY public.bookings.booking_id;


--
-- TOC entry 226 (class 1259 OID 106615)
-- Name: conversations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.conversations (
    conversation_id bigint NOT NULL,
    customer_id bigint NOT NULL,
    instructor_id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.conversations OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 106614)
-- Name: conversations_conversation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.conversations_conversation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.conversations_conversation_id_seq OWNER TO postgres;

--
-- TOC entry 4988 (class 0 OID 0)
-- Dependencies: 225
-- Name: conversations_conversation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.conversations_conversation_id_seq OWNED BY public.conversations.conversation_id;


--
-- TOC entry 224 (class 1259 OID 106594)
-- Name: instructor_posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.instructor_posts (
    post_id bigint NOT NULL,
    instructor_id bigint NOT NULL,
    title character varying(200),
    description text,
    video_url text,
    animation_url text,
    image_url text,
    session_id bigint,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.instructor_posts OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 106593)
-- Name: instructor_posts_post_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.instructor_posts_post_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.instructor_posts_post_id_seq OWNER TO postgres;

--
-- TOC entry 4989 (class 0 OID 0)
-- Dependencies: 223
-- Name: instructor_posts_post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.instructor_posts_post_id_seq OWNED BY public.instructor_posts.post_id;


--
-- TOC entry 228 (class 1259 OID 106635)
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    message_id bigint NOT NULL,
    conversation_id bigint NOT NULL,
    sender_id bigint NOT NULL,
    message text NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    sent_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 106634)
-- Name: messages_message_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.messages_message_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.messages_message_id_seq OWNER TO postgres;

--
-- TOC entry 4990 (class 0 OID 0)
-- Dependencies: 227
-- Name: messages_message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.messages_message_id_seq OWNED BY public.messages.message_id;


--
-- TOC entry 230 (class 1259 OID 106656)
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    notification_id bigint NOT NULL,
    user_id bigint NOT NULL,
    title character varying(200) NOT NULL,
    message text NOT NULL,
    notification_type character varying(50),
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 106655)
-- Name: notifications_notification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_notification_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_notification_id_seq OWNER TO postgres;

--
-- TOC entry 4991 (class 0 OID 0)
-- Dependencies: 229
-- Name: notifications_notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_notification_id_seq OWNED BY public.notifications.notification_id;


--
-- TOC entry 234 (class 1259 OID 106690)
-- Name: session_media; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session_media (
    media_id bigint NOT NULL,
    session_id bigint NOT NULL,
    uploaded_by bigint NOT NULL,
    media_type character varying(20) NOT NULL,
    media_url text NOT NULL,
    caption text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT session_media_media_type_check CHECK (((media_type)::text = ANY ((ARRAY['image'::character varying, 'video'::character varying, 'animation'::character varying])::text[])))
);


ALTER TABLE public.session_media OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 106689)
-- Name: session_media_media_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.session_media_media_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.session_media_media_id_seq OWNER TO postgres;

--
-- TOC entry 4992 (class 0 OID 0)
-- Dependencies: 233
-- Name: session_media_media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.session_media_media_id_seq OWNED BY public.session_media.media_id;


--
-- TOC entry 218 (class 1259 OID 106533)
-- Name: session_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session_types (
    session_type_id bigint NOT NULL,
    name character varying(50) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.session_types OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 106532)
-- Name: session_types_session_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.session_types_session_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.session_types_session_type_id_seq OWNER TO postgres;

--
-- TOC entry 4993 (class 0 OID 0)
-- Dependencies: 217
-- Name: session_types_session_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.session_types_session_type_id_seq OWNED BY public.session_types.session_type_id;


--
-- TOC entry 220 (class 1259 OID 106545)
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    session_id bigint NOT NULL,
    session_type_id bigint NOT NULL,
    instructor_id bigint NOT NULL,
    title character varying(150) NOT NULL,
    description text,
    session_date date NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone,
    maximum_capacity integer NOT NULL,
    available_spaces integer NOT NULL,
    location character varying(200),
    status character varying(20) DEFAULT 'scheduled'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT capacity_check CHECK ((available_spaces <= maximum_capacity)),
    CONSTRAINT sessions_available_spaces_check CHECK ((available_spaces >= 0)),
    CONSTRAINT sessions_maximum_capacity_check CHECK ((maximum_capacity > 0)),
    CONSTRAINT sessions_status_check CHECK (((status)::text = ANY ((ARRAY['scheduled'::character varying, 'ongoing'::character varying, 'completed'::character varying, 'cancelled'::character varying])::text[])))
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 106544)
-- Name: sessions_session_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sessions_session_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sessions_session_id_seq OWNER TO postgres;

--
-- TOC entry 4994 (class 0 OID 0)
-- Dependencies: 219
-- Name: sessions_session_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sessions_session_id_seq OWNED BY public.sessions.session_id;


--
-- TOC entry 216 (class 1259 OID 106516)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    phone character varying(20),
    password character varying(255) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 106515)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 4995 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 232 (class 1259 OID 106672)
-- Name: wellness_articles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wellness_articles (
    article_id bigint NOT NULL,
    author_id bigint NOT NULL,
    title character varying(250) NOT NULL,
    content text NOT NULL,
    featured_image text,
    status character varying(20) DEFAULT 'draft'::character varying NOT NULL,
    published_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT wellness_articles_status_check CHECK (((status)::text = ANY ((ARRAY['draft'::character varying, 'published'::character varying, 'archived'::character varying])::text[])))
);


ALTER TABLE public.wellness_articles OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 106671)
-- Name: wellness_articles_article_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.wellness_articles_article_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.wellness_articles_article_id_seq OWNER TO postgres;

--
-- TOC entry 4996 (class 0 OID 0)
-- Dependencies: 231
-- Name: wellness_articles_article_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.wellness_articles_article_id_seq OWNED BY public.wellness_articles.article_id;


--
-- TOC entry 4740 (class 2604 OID 106574)
-- Name: bookings booking_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings ALTER COLUMN booking_id SET DEFAULT nextval('public.bookings_booking_id_seq'::regclass);


--
-- TOC entry 4747 (class 2604 OID 106618)
-- Name: conversations conversation_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations ALTER COLUMN conversation_id SET DEFAULT nextval('public.conversations_conversation_id_seq'::regclass);


--
-- TOC entry 4744 (class 2604 OID 106597)
-- Name: instructor_posts post_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.instructor_posts ALTER COLUMN post_id SET DEFAULT nextval('public.instructor_posts_post_id_seq'::regclass);


--
-- TOC entry 4749 (class 2604 OID 106638)
-- Name: messages message_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages ALTER COLUMN message_id SET DEFAULT nextval('public.messages_message_id_seq'::regclass);


--
-- TOC entry 4752 (class 2604 OID 106659)
-- Name: notifications notification_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN notification_id SET DEFAULT nextval('public.notifications_notification_id_seq'::regclass);


--
-- TOC entry 4759 (class 2604 OID 106693)
-- Name: session_media media_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session_media ALTER COLUMN media_id SET DEFAULT nextval('public.session_media_media_id_seq'::regclass);


--
-- TOC entry 4734 (class 2604 OID 106536)
-- Name: session_types session_type_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session_types ALTER COLUMN session_type_id SET DEFAULT nextval('public.session_types_session_type_id_seq'::regclass);


--
-- TOC entry 4736 (class 2604 OID 106548)
-- Name: sessions session_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions ALTER COLUMN session_id SET DEFAULT nextval('public.sessions_session_id_seq'::regclass);


--
-- TOC entry 4733 (class 2604 OID 106519)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 4755 (class 2604 OID 106675)
-- Name: wellness_articles article_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wellness_articles ALTER COLUMN article_id SET DEFAULT nextval('public.wellness_articles_article_id_seq'::regclass);


--
-- TOC entry 4969 (class 0 OID 106571)
-- Dependencies: 222
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bookings (booking_id, user_id, session_id, booking_datetime, status, cancelled_at, created_at) FROM stdin;
\.


--
-- TOC entry 4973 (class 0 OID 106615)
-- Dependencies: 226
-- Data for Name: conversations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.conversations (conversation_id, customer_id, instructor_id, created_at) FROM stdin;
\.


--
-- TOC entry 4971 (class 0 OID 106594)
-- Dependencies: 224
-- Data for Name: instructor_posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.instructor_posts (post_id, instructor_id, title, description, video_url, animation_url, image_url, session_id, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4975 (class 0 OID 106635)
-- Dependencies: 228
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (message_id, conversation_id, sender_id, message, is_read, sent_at) FROM stdin;
\.


--
-- TOC entry 4977 (class 0 OID 106656)
-- Dependencies: 230
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (notification_id, user_id, title, message, notification_type, is_read, created_at) FROM stdin;
\.


--
-- TOC entry 4981 (class 0 OID 106690)
-- Dependencies: 234
-- Data for Name: session_media; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.session_media (media_id, session_id, uploaded_by, media_type, media_url, caption, created_at) FROM stdin;
\.


--
-- TOC entry 4965 (class 0 OID 106533)
-- Dependencies: 218
-- Data for Name: session_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.session_types (session_type_id, name, description, created_at) FROM stdin;
1	Yoga	Yoga wellness session	2026-09-30 23:47:47.75415-12
2	Meditation	Meditation and mindfulness session	2026-09-30 23:47:47.75415-12
3	Pilates	Pilates fitness session	2026-09-30 23:47:47.75415-12
4	Ice-Bathing	Ice-bathing wellness session	2026-09-30 23:47:47.75415-12
\.


--
-- TOC entry 4967 (class 0 OID 106545)
-- Dependencies: 220
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (session_id, session_type_id, instructor_id, title, description, session_date, start_time, end_time, maximum_capacity, available_spaces, location, status, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4963 (class 0 OID 106516)
-- Dependencies: 216
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, name, email, phone, password) FROM stdin;
124	jessey	jesseyocran@gmail.com	0556221172	1234567
\.


--
-- TOC entry 4979 (class 0 OID 106672)
-- Dependencies: 232
-- Data for Name: wellness_articles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wellness_articles (article_id, author_id, title, content, featured_image, status, published_at, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4997 (class 0 OID 0)
-- Dependencies: 221
-- Name: bookings_booking_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bookings_booking_id_seq', 1, false);


--
-- TOC entry 4998 (class 0 OID 0)
-- Dependencies: 225
-- Name: conversations_conversation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.conversations_conversation_id_seq', 1, false);


--
-- TOC entry 4999 (class 0 OID 0)
-- Dependencies: 223
-- Name: instructor_posts_post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.instructor_posts_post_id_seq', 1, false);


--
-- TOC entry 5000 (class 0 OID 0)
-- Dependencies: 227
-- Name: messages_message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_message_id_seq', 1, false);


--
-- TOC entry 5001 (class 0 OID 0)
-- Dependencies: 229
-- Name: notifications_notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_notification_id_seq', 1, false);


--
-- TOC entry 5002 (class 0 OID 0)
-- Dependencies: 233
-- Name: session_media_media_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.session_media_media_id_seq', 1, false);


--
-- TOC entry 5003 (class 0 OID 0)
-- Dependencies: 217
-- Name: session_types_session_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.session_types_session_type_id_seq', 4, true);


--
-- TOC entry 5004 (class 0 OID 0)
-- Dependencies: 219
-- Name: sessions_session_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sessions_session_id_seq', 1, false);


--
-- TOC entry 5005 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 1, false);


--
-- TOC entry 5006 (class 0 OID 0)
-- Dependencies: 231
-- Name: wellness_articles_article_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.wellness_articles_article_id_seq', 1, false);


--
-- TOC entry 4782 (class 2606 OID 106580)
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (booking_id);


--
-- TOC entry 4791 (class 2606 OID 106621)
-- Name: conversations conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (conversation_id);


--
-- TOC entry 4789 (class 2606 OID 106603)
-- Name: instructor_posts instructor_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.instructor_posts
    ADD CONSTRAINT instructor_posts_pkey PRIMARY KEY (post_id);


--
-- TOC entry 4796 (class 2606 OID 106644)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (message_id);


--
-- TOC entry 4799 (class 2606 OID 106665)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (notification_id);


--
-- TOC entry 4804 (class 2606 OID 106699)
-- Name: session_media session_media_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session_media
    ADD CONSTRAINT session_media_pkey PRIMARY KEY (media_id);


--
-- TOC entry 4774 (class 2606 OID 106543)
-- Name: session_types session_types_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session_types
    ADD CONSTRAINT session_types_name_key UNIQUE (name);


--
-- TOC entry 4776 (class 2606 OID 106541)
-- Name: session_types session_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session_types
    ADD CONSTRAINT session_types_pkey PRIMARY KEY (session_type_id);


--
-- TOC entry 4780 (class 2606 OID 106559)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (session_id);


--
-- TOC entry 4793 (class 2606 OID 106623)
-- Name: conversations unique_customer_instructor; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT unique_customer_instructor UNIQUE (customer_id, instructor_id);


--
-- TOC entry 4786 (class 2606 OID 106582)
-- Name: bookings unique_user_session; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT unique_user_session UNIQUE (user_id, session_id);


--
-- TOC entry 4770 (class 2606 OID 106523)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4772 (class 2606 OID 106521)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4802 (class 2606 OID 106683)
-- Name: wellness_articles wellness_articles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wellness_articles
    ADD CONSTRAINT wellness_articles_pkey PRIMARY KEY (article_id);


--
-- TOC entry 4800 (class 1259 OID 106718)
-- Name: idx_articles_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_articles_status ON public.wellness_articles USING btree (status);


--
-- TOC entry 4783 (class 1259 OID 106714)
-- Name: idx_bookings_session; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_session ON public.bookings USING btree (session_id);


--
-- TOC entry 4784 (class 1259 OID 106713)
-- Name: idx_bookings_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_user ON public.bookings USING btree (user_id);


--
-- TOC entry 4794 (class 1259 OID 106715)
-- Name: idx_messages_conversation; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_conversation ON public.messages USING btree (conversation_id);


--
-- TOC entry 4797 (class 1259 OID 106716)
-- Name: idx_notifications_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_user ON public.notifications USING btree (user_id);


--
-- TOC entry 4787 (class 1259 OID 106717)
-- Name: idx_posts_instructor; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_posts_instructor ON public.instructor_posts USING btree (instructor_id);


--
-- TOC entry 4777 (class 1259 OID 106711)
-- Name: idx_sessions_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sessions_date ON public.sessions USING btree (session_date);


--
-- TOC entry 4778 (class 1259 OID 106712)
-- Name: idx_sessions_instructor; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sessions_instructor ON public.sessions USING btree (instructor_id);


--
-- TOC entry 4768 (class 1259 OID 106710)
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- TOC entry 4816 (class 2606 OID 106684)
-- Name: wellness_articles fk_article_author; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wellness_articles
    ADD CONSTRAINT fk_article_author FOREIGN KEY (author_id) REFERENCES public.users(user_id) ON DELETE RESTRICT;


--
-- TOC entry 4807 (class 2606 OID 106588)
-- Name: bookings fk_booking_session; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT fk_booking_session FOREIGN KEY (session_id) REFERENCES public.sessions(session_id) ON DELETE CASCADE;


--
-- TOC entry 4808 (class 2606 OID 106583)
-- Name: bookings fk_booking_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4811 (class 2606 OID 106624)
-- Name: conversations fk_conversation_customer; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT fk_conversation_customer FOREIGN KEY (customer_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4812 (class 2606 OID 106629)
-- Name: conversations fk_conversation_instructor; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT fk_conversation_instructor FOREIGN KEY (instructor_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4817 (class 2606 OID 106700)
-- Name: session_media fk_media_session; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session_media
    ADD CONSTRAINT fk_media_session FOREIGN KEY (session_id) REFERENCES public.sessions(session_id) ON DELETE CASCADE;


--
-- TOC entry 4818 (class 2606 OID 106705)
-- Name: session_media fk_media_uploader; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session_media
    ADD CONSTRAINT fk_media_uploader FOREIGN KEY (uploaded_by) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4813 (class 2606 OID 106645)
-- Name: messages fk_message_conversation; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT fk_message_conversation FOREIGN KEY (conversation_id) REFERENCES public.conversations(conversation_id) ON DELETE CASCADE;


--
-- TOC entry 4814 (class 2606 OID 106650)
-- Name: messages fk_message_sender; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT fk_message_sender FOREIGN KEY (sender_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4815 (class 2606 OID 106666)
-- Name: notifications fk_notification_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4809 (class 2606 OID 106604)
-- Name: instructor_posts fk_post_instructor; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.instructor_posts
    ADD CONSTRAINT fk_post_instructor FOREIGN KEY (instructor_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 4810 (class 2606 OID 106609)
-- Name: instructor_posts fk_post_session; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.instructor_posts
    ADD CONSTRAINT fk_post_session FOREIGN KEY (session_id) REFERENCES public.sessions(session_id) ON DELETE SET NULL;


--
-- TOC entry 4805 (class 2606 OID 106565)
-- Name: sessions fk_session_instructor; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT fk_session_instructor FOREIGN KEY (instructor_id) REFERENCES public.users(user_id) ON DELETE RESTRICT;


--
-- TOC entry 4806 (class 2606 OID 106560)
-- Name: sessions fk_session_type; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT fk_session_type FOREIGN KEY (session_type_id) REFERENCES public.session_types(session_type_id) ON DELETE RESTRICT;


-- Completed on 2026-10-02 00:03:34

--
-- PostgreSQL database dump complete
--

\unrestrict EPxYdvVYNUKotHibwhUlBEbafxdS57jKd7PFmPMVXEEdob8s7p2tVCsR3DtxUsB

