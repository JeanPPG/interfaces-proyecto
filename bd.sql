PGDMP      4                 }            hikarishiftx    17.2    17.2                 0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            !           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            "           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            #           1262    16388    hikarishiftx    DATABASE     �   CREATE DATABASE hikarishiftx WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Mexico.1252';
    DROP DATABASE hikarishiftx;
                     postgres    false            �            1259    16390    users    TABLE     }   CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(50) NOT NULL,
    password text NOT NULL
);
    DROP TABLE public.users;
       public         heap r       postgres    false            �            1259    16389    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public               postgres    false    218            $           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public               postgres    false    217            �           2604    16393    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    217    218    218                      0    16390    users 
   TABLE DATA           4   COPY public.users (id, email, password) FROM stdin;
    public               postgres    false    218   �       %           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 4, true);
          public               postgres    false    217            �           2606    16397    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    218            �           2606    16399    users users_username_key 
   CONSTRAINT     T   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (email);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
       public                 postgres    false    218               �   x��K��@ϙߑ�f���N��**��>�%��*�1���;�:E�bL��h�	�Rf�Lq6c����ja`��l��ZC�VQՈ.b.��E����ˁPB6��$��*@n�s�mw,J��H�͇����޼�t#X��"�۟ɰ|޿>��t���WW�=0?����;4��?�b3B     