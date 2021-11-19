--
-- PostgreSQL database dump
--

-- Dumped from database version 13.3
-- Dumped by pg_dump version 14.0

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: app_permission; Type: TYPE; Schema: public; Owner: supabase_admin
--

CREATE TYPE public.app_permission AS ENUM (
    'event.delete',
    'event.update'
);


ALTER TYPE public.app_permission OWNER TO supabase_admin;

--
-- Name: app_role; Type: TYPE; Schema: public; Owner: supabase_admin
--

CREATE TYPE public.app_role AS ENUM (
    'admin',
    'editor'
);


ALTER TYPE public.app_role OWNER TO supabase_admin;

--
-- Name: archive_event_stats(); Type: FUNCTION; Schema: public; Owner: supabase_admin
--

CREATE FUNCTION public.archive_event_stats() RETURNS TABLE(events_per_year bigint, from_year text)
    LANGUAGE plpgsql
    AS $$
    BEGIN
        RETURN QUERY
            select
              count(e.id) as events_per_year,
              to_char(date_trunc('year', e."fromDate"), 'YYYY') as from_year
            from events e
            where e."fromDate" <= now()

            group by from_year
            order by from_year desc;
    END;
$$;


ALTER FUNCTION public.archive_event_stats() OWNER TO supabase_admin;

--
-- Name: authorize(public.app_permission, uuid); Type: FUNCTION; Schema: public; Owner: supabase_admin
--

CREATE FUNCTION public.authorize(requested_permission public.app_permission, user_id uuid) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
declare
  bind_permissions int;
begin
  select count(*)
  from public.role_permissions
  inner join public.user_roles on role_permissions.role = user_roles.role
  where role_permissions.permission = authorize.requested_permission
    and user_roles.user_id = authorize.user_id
  into bind_permissions;
  
  return bind_permissions > 0;
end;
$$;


ALTER FUNCTION public.authorize(requested_permission public.app_permission, user_id uuid) OWNER TO supabase_admin;

--
-- Name: event_stats(); Type: FUNCTION; Schema: public; Owner: supabase_admin
--

CREATE FUNCTION public.event_stats() RETURNS TABLE(events_per_year bigint, from_year text)
    LANGUAGE plpgsql
    AS $$
    BEGIN
        RETURN QUERY
            select
              count(e.id) as events_per_year,
              to_char(date_trunc('year', e."fromDate"), 'YYYY') as from_year
              --date_trunc('year', e."fromDate") as from_year
            from events e

            group by from_year
            order by from_year desc;
    END;
$$;


ALTER FUNCTION public.event_stats() OWNER TO supabase_admin;

--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: supabase_admin
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;


ALTER FUNCTION public.handle_new_user() OWNER TO supabase_admin;

--
-- Name: location_stats(); Type: FUNCTION; Schema: public; Owner: supabase_admin
--

CREATE FUNCTION public.location_stats() RETURNS TABLE(location_count bigint)
    LANGUAGE plpgsql
    AS $$
    BEGIN
        RETURN QUERY
            select
              count(l.id) as location_count
            from locations l;
    END;
$$;


ALTER FUNCTION public.location_stats() OWNER TO supabase_admin;

--
-- Name: unique_short_id(); Type: FUNCTION; Schema: public; Owner: supabase_admin
--

CREATE FUNCTION public.unique_short_id() RETURNS trigger
    LANGUAGE plpgsql
    AS $$

 -- Declare the variables we'll be using.
DECLARE
  key TEXT;
  qry TEXT;
  found TEXT;
BEGIN

  -- generate the first part of a query as a string with safely
  -- escaped table name, using || to concat the parts
  qry := 'SELECT id FROM ' || quote_ident(TG_TABLE_NAME) || ' WHERE id=';

  -- This loop will probably only run once per call until we've generated
  -- millions of ids.
  LOOP

    -- Generate our string bytes and re-encode as a base64 string.
    key := encode(gen_random_bytes(6), 'base64');

    -- Base64 encoding contains 2 URL unsafe characters by default.
    -- The URL-safe version has these replacements.
    key := replace(key, '/', '_'); -- url safe replacement
    key := replace(key, '+', '-'); -- url safe replacement

    -- Concat the generated key (safely quoted) with the generated query
    -- and run it.
    -- SELECT id FROM "test" WHERE id='blahblah' INTO found
    -- Now "found" will be the duplicated id or NULL.
    EXECUTE qry || quote_literal(key) INTO found;

    -- Check to see if found is NULL.
    -- If we checked to see if found = NULL it would always be FALSE
    -- because (NULL = NULL) is always FALSE.
    IF found IS NULL THEN

      -- If we didn't find a collision then leave the LOOP.
      EXIT;
    END IF;

    -- We haven't EXITed yet, so return to the top of the LOOP
    -- and try again.
  END LOOP;

  -- NEW and OLD are available in TRIGGER PROCEDURES.
  -- NEW is the mutated row that will actually be INSERTed.
  -- We're replacing id, regardless of what it was before
  -- with our key variable.
  NEW.id = key;

  -- The RECORD returned here is what will actually be INSERTed,
  -- or what the next trigger will get if there is one.
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.unique_short_id() OWNER TO supabase_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: emails; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.emails (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    key character varying NOT NULL
);


ALTER TABLE public.emails OWNER TO supabase_admin;

--
-- Name: emails_id_seq; Type: SEQUENCE; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.emails ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.emails_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: event_list; Type: VIEW; Schema: public; Owner: supabase_admin
--

CREATE VIEW public.event_list AS
SELECT
    NULL::uuid AS id,
    NULL::uuid AS author,
    NULL::timestamp with time zone AS "fromDate",
    NULL::timestamp with time zone AS "toDate",
    NULL::uuid AS location,
    NULL::character varying AS url,
    NULL::text AS description,
    NULL::character varying AS location_name,
    NULL::timestamp without time zone AS created_at,
    NULL::character varying AS "ticketPrice",
    NULL::uuid AS parent_event,
    NULL::boolean AS verified,
    NULL::character varying AS "legacyId",
    NULL::json AS child_events,
    NULL::text AS title;


ALTER TABLE public.event_list OWNER TO supabase_admin;

--
-- Name: event_updates; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.event_updates (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    event_id uuid NOT NULL,
    changes json,
    created_at timestamp without time zone DEFAULT now(),
    summary text NOT NULL
);


ALTER TABLE public.event_updates OWNER TO supabase_admin;

--
-- Name: events; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.events (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    "fromDate" timestamp with time zone DEFAULT now(),
    bands character varying[],
    "toDate" timestamp with time zone,
    location uuid,
    author uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    description text,
    title text,
    parent_event uuid,
    url character varying,
    "ticketPrice" character varying,
    verified boolean DEFAULT false NOT NULL,
    "legacyId" character varying,
    canceled boolean
);


ALTER TABLE public.events OWNER TO supabase_admin;

--
-- Name: feedback; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.feedback (
    id bigint NOT NULL,
    mood character varying,
    content text,
    page character varying
);


ALTER TABLE public.feedback OWNER TO supabase_admin;

--
-- Name: feedback_id_seq; Type: SEQUENCE; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.feedback ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.feedback_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: likes; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.likes (
    id bigint NOT NULL,
    profile_id uuid,
    event_id uuid
);


ALTER TABLE public.likes OWNER TO supabase_admin;

--
-- Name: likes_id_seq; Type: SEQUENCE; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.likes ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.likes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: locations; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.locations (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.locations OWNER TO supabase_admin;

--
-- Name: profiles; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    updated_at timestamp with time zone,
    username text,
    avatar_url text,
    website text,
    "calendarToken" character varying,
    immediate_updates boolean,
    weekly_updates boolean,
    email text NOT NULL
);


ALTER TABLE public.profiles OWNER TO supabase_admin;

--
-- Name: COLUMN profiles.immediate_updates; Type: COMMENT; Schema: public; Owner: supabase_admin
--

COMMENT ON COLUMN public.profiles.immediate_updates IS 'Send immediate updates to user';


--
-- Name: COLUMN profiles.weekly_updates; Type: COMMENT; Schema: public; Owner: supabase_admin
--

COMMENT ON COLUMN public.profiles.weekly_updates IS 'Send weekly summary to user';


--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.role_permissions (
    id bigint NOT NULL,
    role public.app_role NOT NULL,
    permission public.app_permission NOT NULL
);


ALTER TABLE public.role_permissions OWNER TO supabase_admin;

--
-- Name: TABLE role_permissions; Type: COMMENT; Schema: public; Owner: supabase_admin
--

COMMENT ON TABLE public.role_permissions IS 'Application permissions for each role.';


--
-- Name: role_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.role_permissions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.role_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: top_liked_week; Type: VIEW; Schema: public; Owner: supabase_admin
--

CREATE VIEW public.top_liked_week AS
 SELECT e.id,
    e.title,
    e."fromDate",
    count(l.id) AS likes_count
   FROM (public.event_list e
     LEFT JOIN public.likes l ON ((l.event_id = e.id)))
  WHERE ((e."fromDate" >= now()) AND (e."fromDate" <= (now() + '7 days'::interval)))
  GROUP BY e.id, e."fromDate", e.title, e.created_at
  ORDER BY (count(l.id)) DESC, e.created_at DESC;


ALTER TABLE public.top_liked_week OWNER TO supabase_admin;

--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE public.user_roles (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role NOT NULL
);


ALTER TABLE public.user_roles OWNER TO supabase_admin;

--
-- Name: TABLE user_roles; Type: COMMENT; Schema: public; Owner: supabase_admin
--

COMMENT ON TABLE public.user_roles IS 'Application roles for each user.';


--
-- Name: user_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.user_roles ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.user_roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: emails emails_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.emails
    ADD CONSTRAINT emails_pkey PRIMARY KEY (id);


--
-- Name: event_updates event_updates_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.event_updates
    ADD CONSTRAINT event_updates_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: feedback feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (id);


--
-- Name: likes likes_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_pkey PRIMARY KEY (id);


--
-- Name: locations locations_name_unique; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_name_unique UNIQUE (name);


--
-- Name: locations locations_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_username_key; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_username_key UNIQUE (username);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_role_permission_key; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_permission_key UNIQUE (role, permission);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: event_list _RETURN; Type: RULE; Schema: public; Owner: supabase_admin
--

CREATE OR REPLACE VIEW public.event_list AS
 SELECT event.id,
    event.author,
    event."fromDate",
    event."toDate",
    event.location,
    event.url,
    event.description,
    location.name AS location_name,
    event.created_at,
    event."ticketPrice",
    event.parent_event,
    event.verified,
    event."legacyId",
    COALESCE(json_agg(json_build_object('id', child_event.id, 'title', child_event.title, 'fromDate', child_event."fromDate")) FILTER (WHERE (child_event.id IS NOT NULL)), '[]'::json) AS child_events,
    event.title
   FROM ((public.events event
     LEFT JOIN public.events child_event ON ((event.id = child_event.parent_event)))
     LEFT JOIN public.locations location ON ((event.location = location.id)))
  WHERE (event.parent_event IS NULL)
  GROUP BY event.id, location.name
  ORDER BY event."fromDate", event.title, event.created_at DESC;


--
-- Name: events send-event-insert-email; Type: TRIGGER; Schema: public; Owner: supabase_admin
--

CREATE TRIGGER "send-event-insert-email" AFTER INSERT ON public.events FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://derkonzert.de/api/notify/event', 'POST', '{"Content-type":"application/json"}', '{}', '1000');


--
-- Name: feedback send-feedback-insert-email; Type: TRIGGER; Schema: public; Owner: supabase_admin
--

CREATE TRIGGER "send-feedback-insert-email" AFTER INSERT ON public.feedback FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://derkonzert.de/api/notify/feedback', 'POST', '{"Content-type":"application/json"}', '{}', '1000');


--
-- Name: event_updates event_updates_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.event_updates
    ADD CONSTRAINT event_updates_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- Name: events events_author_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_author_fkey FOREIGN KEY (author) REFERENCES public.profiles(id) ON DELETE SET NULL;


--
-- Name: events events_location_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_location_fkey FOREIGN KEY (location) REFERENCES public.locations(id);


--
-- Name: events events_parent_event_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_parent_event_fkey FOREIGN KEY (parent_event) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- Name: likes likes_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- Name: likes likes_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id);


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: events Allow authorized deletes; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Allow authorized deletes" ON public.events FOR DELETE USING (public.authorize('event.delete'::public.app_permission, auth.uid()));


--
-- Name: events Allow event updates only to admins; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Allow event updates only to admins" ON public.events FOR UPDATE USING (public.authorize('event.update'::public.app_permission, auth.uid())) WITH CHECK (public.authorize('event.update'::public.app_permission, auth.uid()));


--
-- Name: user_roles Allow individual read access; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Allow individual read access" ON public.user_roles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: event_updates Any one can create; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Any one can create" ON public.event_updates FOR INSERT WITH CHECK (true);


--
-- Name: events Anyone can select events; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Anyone can select events" ON public.events FOR SELECT USING (true);


--
-- Name: event_updates Anyone can view; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Anyone can view" ON public.event_updates FOR SELECT USING (true);


--
-- Name: events Enable insert for anyone; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable insert for anyone" ON public.events FOR INSERT WITH CHECK (true);


--
-- Name: feedback Enable insert for anyone; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable insert for anyone" ON public.feedback FOR INSERT WITH CHECK (true);


--
-- Name: event_updates Only admin can delete; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Only admin can delete" ON public.event_updates FOR DELETE USING (public.authorize('event.delete'::public.app_permission, auth.uid()));


--
-- Name: profiles Public profiles are viewable by everyone.; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);


--
-- Name: likes User can see his likes; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "User can see his likes" ON public.likes FOR SELECT USING ((auth.uid() = profile_id));


--
-- Name: likes Users can delete their own likes; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Users can delete their own likes" ON public.likes FOR DELETE USING ((auth.uid() = profile_id));


--
-- Name: likes Users can insert likes for themselves; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Users can insert likes for themselves" ON public.likes FOR INSERT WITH CHECK ((auth.uid() = profile_id));


--
-- Name: profiles Users can insert their own profile.; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = id));


--
-- Name: profiles Users can update own profile.; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- Name: event_updates; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.event_updates ENABLE ROW LEVEL SECURITY;

--
-- Name: events; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

--
-- Name: feedback; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

--
-- Name: likes; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: role_permissions; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: FUNCTION archive_event_stats(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.archive_event_stats() TO postgres;
GRANT ALL ON FUNCTION public.archive_event_stats() TO anon;
GRANT ALL ON FUNCTION public.archive_event_stats() TO authenticated;
GRANT ALL ON FUNCTION public.archive_event_stats() TO service_role;


--
-- Name: FUNCTION authorize(requested_permission public.app_permission, user_id uuid); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.authorize(requested_permission public.app_permission, user_id uuid) TO postgres;
GRANT ALL ON FUNCTION public.authorize(requested_permission public.app_permission, user_id uuid) TO anon;
GRANT ALL ON FUNCTION public.authorize(requested_permission public.app_permission, user_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.authorize(requested_permission public.app_permission, user_id uuid) TO service_role;


--
-- Name: FUNCTION event_stats(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.event_stats() TO postgres;
GRANT ALL ON FUNCTION public.event_stats() TO anon;
GRANT ALL ON FUNCTION public.event_stats() TO authenticated;
GRANT ALL ON FUNCTION public.event_stats() TO service_role;


--
-- Name: FUNCTION handle_new_user(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.handle_new_user() TO postgres;
GRANT ALL ON FUNCTION public.handle_new_user() TO anon;
GRANT ALL ON FUNCTION public.handle_new_user() TO authenticated;
GRANT ALL ON FUNCTION public.handle_new_user() TO service_role;


--
-- Name: FUNCTION location_stats(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.location_stats() TO postgres;
GRANT ALL ON FUNCTION public.location_stats() TO anon;
GRANT ALL ON FUNCTION public.location_stats() TO authenticated;
GRANT ALL ON FUNCTION public.location_stats() TO service_role;


--
-- Name: FUNCTION unique_short_id(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.unique_short_id() TO postgres;
GRANT ALL ON FUNCTION public.unique_short_id() TO anon;
GRANT ALL ON FUNCTION public.unique_short_id() TO authenticated;
GRANT ALL ON FUNCTION public.unique_short_id() TO service_role;


--
-- Name: TABLE emails; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.emails TO postgres;
GRANT ALL ON TABLE public.emails TO anon;
GRANT ALL ON TABLE public.emails TO authenticated;
GRANT ALL ON TABLE public.emails TO service_role;


--
-- Name: SEQUENCE emails_id_seq; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE public.emails_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.emails_id_seq TO anon;
GRANT ALL ON SEQUENCE public.emails_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.emails_id_seq TO service_role;


--
-- Name: TABLE event_list; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.event_list TO postgres;
GRANT ALL ON TABLE public.event_list TO anon;
GRANT ALL ON TABLE public.event_list TO authenticated;
GRANT ALL ON TABLE public.event_list TO service_role;


--
-- Name: TABLE event_updates; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.event_updates TO postgres;
GRANT ALL ON TABLE public.event_updates TO anon;
GRANT ALL ON TABLE public.event_updates TO authenticated;
GRANT ALL ON TABLE public.event_updates TO service_role;


--
-- Name: TABLE events; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.events TO postgres;
GRANT ALL ON TABLE public.events TO anon;
GRANT ALL ON TABLE public.events TO authenticated;
GRANT ALL ON TABLE public.events TO service_role;


--
-- Name: TABLE feedback; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.feedback TO postgres;
GRANT ALL ON TABLE public.feedback TO anon;
GRANT ALL ON TABLE public.feedback TO authenticated;
GRANT ALL ON TABLE public.feedback TO service_role;


--
-- Name: SEQUENCE feedback_id_seq; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE public.feedback_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.feedback_id_seq TO anon;
GRANT ALL ON SEQUENCE public.feedback_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.feedback_id_seq TO service_role;


--
-- Name: TABLE likes; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.likes TO postgres;
GRANT ALL ON TABLE public.likes TO anon;
GRANT ALL ON TABLE public.likes TO authenticated;
GRANT ALL ON TABLE public.likes TO service_role;


--
-- Name: SEQUENCE likes_id_seq; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE public.likes_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.likes_id_seq TO anon;
GRANT ALL ON SEQUENCE public.likes_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.likes_id_seq TO service_role;


--
-- Name: TABLE locations; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.locations TO postgres;
GRANT ALL ON TABLE public.locations TO anon;
GRANT ALL ON TABLE public.locations TO authenticated;
GRANT ALL ON TABLE public.locations TO service_role;


--
-- Name: TABLE profiles; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.profiles TO postgres;
GRANT ALL ON TABLE public.profiles TO anon;
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;


--
-- Name: TABLE role_permissions; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.role_permissions TO postgres;
GRANT ALL ON TABLE public.role_permissions TO anon;
GRANT ALL ON TABLE public.role_permissions TO authenticated;
GRANT ALL ON TABLE public.role_permissions TO service_role;


--
-- Name: SEQUENCE role_permissions_id_seq; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE public.role_permissions_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.role_permissions_id_seq TO anon;
GRANT ALL ON SEQUENCE public.role_permissions_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.role_permissions_id_seq TO service_role;


--
-- Name: TABLE top_liked_week; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.top_liked_week TO postgres;
GRANT ALL ON TABLE public.top_liked_week TO anon;
GRANT ALL ON TABLE public.top_liked_week TO authenticated;
GRANT ALL ON TABLE public.top_liked_week TO service_role;


--
-- Name: TABLE user_roles; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE public.user_roles TO postgres;
GRANT ALL ON TABLE public.user_roles TO anon;
GRANT ALL ON TABLE public.user_roles TO authenticated;
GRANT ALL ON TABLE public.user_roles TO service_role;


--
-- Name: SEQUENCE user_roles_id_seq; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE public.user_roles_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.user_roles_id_seq TO anon;
GRANT ALL ON SEQUENCE public.user_roles_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.user_roles_id_seq TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON SEQUENCES  FROM postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public REVOKE ALL ON SEQUENCES  FROM supabase_admin;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON FUNCTIONS  FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON FUNCTIONS  FROM postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public REVOKE ALL ON FUNCTIONS  FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public REVOKE ALL ON FUNCTIONS  FROM supabase_admin;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON TABLES  FROM postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public REVOKE ALL ON TABLES  FROM supabase_admin;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO service_role;


--
-- PostgreSQL database dump complete
--

