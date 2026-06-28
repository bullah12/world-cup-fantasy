begin;

alter table public.predictions
  add column if not exists penalty_winner text;

alter table public.prediction_history
  add column if not exists penalty_winner text;

alter table public.results
  add column if not exists penalty_winner text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'predictions_penalty_winner_check'
      and conrelid = 'public.predictions'::regclass
  ) then
    alter table public.predictions
      add constraint predictions_penalty_winner_check
      check (penalty_winner is null or penalty_winner in ('HOME', 'AWAY'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'prediction_history_penalty_winner_check'
      and conrelid = 'public.prediction_history'::regclass
  ) then
    alter table public.prediction_history
      add constraint prediction_history_penalty_winner_check
      check (penalty_winner is null or penalty_winner in ('HOME', 'AWAY'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'results_penalty_winner_check'
      and conrelid = 'public.results'::regclass
  ) then
    alter table public.results
      add constraint results_penalty_winner_check
      check (penalty_winner is null or penalty_winner in ('HOME', 'AWAY'));
  end if;
end
$$;

update public.matches as match
set
  home_team = fixture.home_team,
  away_team = fixture.away_team
from (
  values
    ('M073', 'Canada', 'South Africa'),
    ('M074', 'Germany', 'Paraguay'),
    ('M075', 'Netherlands', 'Morocco'),
    ('M076', 'Brazil', 'Japan'),
    ('M077', 'France', 'Sweden'),
    ('M078', 'Côte d’Ivoire', 'Norway'),
    ('M079', 'Mexico', 'Ecuador'),
    ('M080', 'England', 'Congo DR'),
    ('M081', 'United States', 'Bosnia and Herzegovina'),
    ('M082', 'Belgium', 'Senegal'),
    ('M083', 'Portugal', 'Croatia'),
    ('M084', 'Spain', 'Austria'),
    ('M085', 'Switzerland', 'Algeria'),
    ('M086', 'Argentina', 'Cabo Verde'),
    ('M087', 'Colombia', 'Ghana'),
    ('M088', 'Australia', 'Egypt')
) as fixture(id, home_team, away_team)
where match.id = fixture.id;

update public.app_settings
set value = jsonb_set(
  coalesce(value, '{}'::jsonb),
  '{points}',
  coalesce(value->'points', '{}'::jsonb) ||
    '{"penaltyWinnerBonus": 2}'::jsonb,
  true
)
where key = 'scoring_config';

commit;

notify pgrst, 'reload schema';

select id, home_team, away_team, kickoff
from public.matches
where id between 'M073' and 'M088'
order by id;
