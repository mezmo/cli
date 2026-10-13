-- default configuration values
insert into kv (key, version, value, created) values ('core.host.api', 1, jsonb('"https://api.mezmo.com"'), strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) on conflict(key) do nothing;
insert into kv (key, version, value, created) values ('core.host.stream', 1, jsonb('"https://tail.mezmo.com"'), strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) on conflict(key) do nothing;
insert into kv (key, version, value, created) values ('core.log.level', 1, jsonb('"ERROR"'), strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) on conflict(key) do nothing;
insert into kv (key, version, value, created) values ('search.page.ttl', 1, jsonb('60000'), strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) on conflict(key) do nothing;
insert into kv (key, version, value, created) values ('search.page.limit', 1, jsonb('100'), strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) on conflict(key) do nothing;
