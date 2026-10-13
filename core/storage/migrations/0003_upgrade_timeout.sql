-- upgrade timeout (5 minutes)
insert into kv (key, version, value, created) values ('core.upgrade.timeout', 1, jsonb('300000'), strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) on conflict(key) do nothing;
