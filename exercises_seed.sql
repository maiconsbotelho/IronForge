-- Clear existing data if needed (optional, be careful)
-- DELETE FROM public.exercises;

-- Inserting Exercises individually to get IDs would be ideal, but for seed we can rely on names being unique enough or just inserts.
-- However, we need to link patterns. The best way for a raw SQL seed without IDs is to use a DO block or multiple inserts with subqueries.

DO $$
DECLARE
  v_ex_id uuid;
BEGIN

-- 1. Air Squat (DSB)
INSERT INTO public.exercises (name, category, description, equipment) VALUES ('Air Squat', 'gymnastics', 'Agachamento com peso do corpo.', '{}') RETURNING id INTO v_ex_id;
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'DSB');

-- 2. Front Squat (DSB)
INSERT INTO public.exercises (name, category, description, equipment) VALUES ('Front Squat', 'strength', 'Agachamento com barra na frente.', '{barbell}') RETURNING id INTO v_ex_id;
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'DSB');

-- 3. Back Squat (DSB)
INSERT INTO public.exercises (name, category, description, equipment) VALUES ('Back Squat', 'strength', 'Agachamento com barra nas costas.', '{barbell}') RETURNING id INTO v_ex_id;
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'DSB');

-- 4. Overhead Squat (DSB)
INSERT INTO public.exercises (name, category, description, equipment) VALUES ('Overhead Squat', 'strength', 'Agachamento com barra acima da cabeça.', '{barbell}') RETURNING id INTO v_ex_id;
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'DSB');

-- 5. Deadlift (DQB)
INSERT INTO public.exercises (name, category, description, equipment) VALUES ('Deadlift', 'strength', 'Levantamento Terra.', '{barbell}') RETURNING id INTO v_ex_id;
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'DQB');

-- 6. Sumo Deadlift High Pull (DQB, EV)
INSERT INTO public.exercises (name, category, description, equipment) VALUES ('Sumo Deadlift High Pull', 'conditioning', 'Puxada alta sumô.', '{barbell}') RETURNING id INTO v_ex_id;
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'DQB');
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'EV');

-- 7. Push Press (PV, DSB) - though mostly PV
INSERT INTO public.exercises (name, category, description, equipment) VALUES ('Push Press', 'strength', 'Desenvolvimento com impulso das pernas.', '{barbell}') RETURNING id INTO v_ex_id;
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'PV');
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'DSB');

-- 8. Push Jerk (PV, DSB)
INSERT INTO public.exercises (name, category, description, equipment) VALUES ('Push Jerk', 'strength', 'Segundo tempo de arremesso.', '{barbell}') RETURNING id INTO v_ex_id;
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'PV');
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'DSB');

-- 9. Strict Press (PV)
INSERT INTO public.exercises (name, category, description, equipment) VALUES ('Strict Press', 'strength', 'Desenvolvimento estrito.', '{barbell}') RETURNING id INTO v_ex_id;
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'PV');

-- 10. Bench Press (PH)
INSERT INTO public.exercises (name, category, description, equipment) VALUES ('Bench Press', 'strength', 'Supino.', '{barbell}') RETURNING id INTO v_ex_id;
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'PH');

-- 11. Pull-up (EV)
INSERT INTO public.exercises (name, category, description, equipment) VALUES ('Pull-up', 'gymnastics', 'Barra fixa.', '{bodyweight}') RETURNING id INTO v_ex_id;
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'EV');

-- 12. Chest-to-Bar Pull-up (EV)
INSERT INTO public.exercises (name, category, description, equipment) VALUES ('Chest-to-Bar Pull-up', 'gymnastics', 'Peito na barra.', '{bodyweight}') RETURNING id INTO v_ex_id;
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'EV');

-- 13. Ring Muscle-up (EV, PV)
INSERT INTO public.exercises (name, category, description, equipment) VALUES ('Ring Muscle-up', 'gymnastics', 'Muscle-up nas argolas.', '{bodyweight}') RETURNING id INTO v_ex_id;
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'EV');
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'PV');

-- 14. Bar Muscle-up (EV, PV)
INSERT INTO public.exercises (name, category, description, equipment) VALUES ('Bar Muscle-up', 'gymnastics', 'Muscle-up na barra.', '{bodyweight}') RETURNING id INTO v_ex_id;
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'EV');
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'PV');

-- 15. Push-up (PH, CORE)
INSERT INTO public.exercises (name, category, description, equipment) VALUES ('Push-up', 'gymnastics', 'Flexão de braço.', '{bodyweight}') RETURNING id INTO v_ex_id;
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'PH');
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'CORE');

-- 16. Handstand Push-up (PV)
INSERT INTO public.exercises (name, category, description, equipment) VALUES ('Handstand Push-up', 'gymnastics', 'Flexão de braço na vertical.', '{bodyweight}') RETURNING id INTO v_ex_id;
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'PV');

-- 17. Thruster (DSB, PV)
INSERT INTO public.exercises (name, category, description, equipment) VALUES ('Thruster', 'conditioning', 'Agachamento + Desenvolvimento.', '{barbell}') RETURNING id INTO v_ex_id;
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'DSB');
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'PV');

-- 18. Wall Ball (DSB, PV)
INSERT INTO public.exercises (name, category, description, equipment) VALUES ('Wall Ball', 'conditioning', 'Bola na parede.', '{medicine_ball}') RETURNING id INTO v_ex_id;
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'DSB');
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'PV');

-- 19. Kettlebell Swing (DQB)
INSERT INTO public.exercises (name, category, description, equipment) VALUES ('Kettlebell Swing', 'conditioning', 'Swing com KB.', '{kettlebell}') RETURNING id INTO v_ex_id;
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'DQB');

-- 20. Double Under (COND)
INSERT INTO public.exercises (name, category, description, equipment) VALUES ('Double Under', 'conditioning', 'Salto duplo de corda.', '{jump_rope}') RETURNING id INTO v_ex_id;
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'COND');

-- 21. Row (COND)
INSERT INTO public.exercises (name, category, description, equipment) VALUES ('Row', 'conditioning', 'Remo (Ergômetro).', '{machine}') RETURNING id INTO v_ex_id;
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'COND');
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'DQB'); -- Arguably leg/hip drive

-- 22. Run (COND)
INSERT INTO public.exercises (name, category, description, equipment) VALUES ('Run', 'conditioning', 'Corrida.', '{}') RETURNING id INTO v_ex_id;
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'COND');

-- 23. Box Jump (DSB) - Plyometric
INSERT INTO public.exercises (name, category, description, equipment) VALUES ('Box Jump', 'conditioning', 'Salto na caixa.', '{box}') RETURNING id INTO v_ex_id;
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'DSB');

-- 24. Burpee (COND, PH, DSB) - Full body
INSERT INTO public.exercises (name, category, description, equipment) VALUES ('Burpee', 'conditioning', 'Burpee.', '{bodyweight}') RETURNING id INTO v_ex_id;
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'COND');
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'PH');

-- 25. Snatch (DQB, PV, EV, DSB) - Full body olympic lift, simplifying to Pull/Push details usually
INSERT INTO public.exercises (name, category, description, equipment) VALUES ('Snatch', 'strength', 'Arranco.', '{barbell}') RETURNING id INTO v_ex_id;
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'DQB'); -- Pull off floor
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'PV'); -- Catch Overhead
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'DSB'); -- Receiving position

-- 26. Clean (DQB, DSB)
INSERT INTO public.exercises (name, category, description, equipment) VALUES ('Clean', 'strength', 'Arremesso (1º tempo).', '{barbell}') RETURNING id INTO v_ex_id;
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'DQB');
INSERT INTO public.exercise_patterns (exercise_id, pattern_code) VALUES (v_ex_id, 'DSB');

END $$;
