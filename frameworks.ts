import { Framework } from './types';
import { mergeAndSortTextToolLinks, standardImageVideoAlternatives, standardMusicAlternatives } from './frameworkUtils';

export const frameworks: Framework[] = [
  // ==========================================
  // --- 1. TEXT FRAMEWORKS ---
  // ==========================================
  {
    id: 'rtf',
    idLocale: {
      name: 'rtf_name',
      shortName: 'rtf_shortName',
      description: 'rtf_description',
      shortDescription: 'rtf_short_desc',
      category: 'text',
      components: [
        { id: 'role', label: 'rtf_role_label', example: 'rtf_role_example', tooltip: 'rtf_role_tooltip' },
        { id: 'task', label: 'rtf_task_label', example: 'rtf_task_example', tooltip: 'rtf_task_tooltip' },
        { id: 'format', label: 'rtf_format_label', example: 'rtf_format_example', tooltip: 'rtf_format_tooltip' },
      ],
      genericToolLinks: mergeAndSortTextToolLinks(),
    },
    enLocale: {
      name: 'rtf_name',
      shortName: 'rtf_shortName',
      description: 'rtf_description',
      shortDescription: 'rtf_short_desc',
      category: 'text',
      components: [
        { id: 'role', label: 'rtf_role_label', example: 'rtf_role_example', tooltip: 'rtf_role_tooltip' },
        { id: 'task', label: 'rtf_task_label', example: 'rtf_task_example', tooltip: 'rtf_task_tooltip' },
        { id: 'format', label: 'rtf_format_label', example: 'rtf_format_example', tooltip: 'rtf_format_tooltip' },
      ],
      genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },
  {
    id: 'aida',
    idLocale: {
      name: 'aida_name',
      shortName: 'aida_shortName',
      description: 'aida_description',
      shortDescription: 'aida_short_desc',
      category: 'text',
      components: [
        { id: 'attention', label: 'aida_attention_label', example: 'aida_attention_example', tooltip: 'aida_attention_tooltip' },
        { id: 'interest', label: 'aida_interest_label', example: 'aida_interest_example', tooltip: 'aida_interest_tooltip' },
        { id: 'desire', label: 'aida_desire_label', example: 'aida_desire_example', tooltip: 'aida_desire_tooltip' },
        { id: 'action', label: 'aida_action_label', example: 'aida_action_example', tooltip: 'aida_action_tooltip' },
      ],
      genericToolLinks: mergeAndSortTextToolLinks(),
    },
    enLocale: {
      name: 'aida_name',
      shortName: 'aida_shortName',
      description: 'aida_description',
      shortDescription: 'aida_short_desc',
      category: 'text',
      components: [
        { id: 'attention', label: 'aida_attention_label', example: 'aida_attention_example', tooltip: 'aida_attention_tooltip' },
        { id: 'interest', label: 'aida_interest_label', example: 'aida_interest_example', tooltip: 'aida_interest_tooltip' },
        { id: 'desire', label: 'aida_desire_label', example: 'aida_desire_example', tooltip: 'aida_desire_tooltip' },
        { id: 'action', label: 'aida_action_label', example: 'aida_action_example', tooltip: 'aida_action_tooltip' },
      ],
      genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },
  {
    id: 'care',
    idLocale: {
      name: 'care_name',
      shortName: 'care_shortName',
      description: 'care_description',
      shortDescription: 'care_short_desc',
      category: 'text',
      components: [
        { id: 'context', label: 'care_comp1_label', example: 'care_comp1_example', tooltip: 'care_context_tooltip' },
        { id: 'action', label: 'care_comp2_label', example: 'care_comp2_example', tooltip: 'care_action_tooltip' },
        { id: 'result', label: 'care_comp3_label', example: 'care_comp3_example', tooltip: 'care_result_tooltip' },
        { id: 'example', label: 'care_comp4_label', example: 'care_comp4_example', tooltip: 'care_example_tooltip' },
      ],
      genericToolLinks: mergeAndSortTextToolLinks(),
    },
    enLocale: {
      name: 'care_name',
      shortName: 'care_shortName',
      description: 'care_description',
      shortDescription: 'care_short_desc',
      category: 'text',
      components: [
        { id: 'context', label: 'care_comp1_label', example: 'care_comp1_example', tooltip: 'care_context_tooltip' },
        { id: 'action', label: 'care_comp2_label', example: 'care_comp2_example', tooltip: 'care_action_tooltip' },
        { id: 'result', label: 'care_comp3_label', example: 'care_comp3_example', tooltip: 'care_result_tooltip' },
        { id: 'example', label: 'care_comp4_label', example: 'care_comp4_example', tooltip: 'care_example_tooltip' },
      ],
      genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },
  {
    id: 'co-star',
    idLocale: {
      name: 'co_star_name',
      shortName: 'co_star_shortName',
      description: 'co_star_description',
      shortDescription: 'co_star_short_desc',
      category: 'text',
      components: [
        { id: 'context', label: 'co_star_comp1_label', example: 'co_star_comp1_example', tooltip: 'costar_context_tooltip' },
        { id: 'objective', label: 'co_star_comp2_label', example: 'co_star_comp2_example', tooltip: 'costar_objective_tooltip' },
        { id: 'style', label: 'co_star_comp3_label', example: 'co_star_comp3_example', tooltip: 'costar_style_tooltip' },
        { id: 'tone', label: 'co_star_comp4_label', example: 'co_star_comp4_example', tooltip: 'costar_tone_tooltip' },
        { id: 'audience', label: 'co_star_comp5_label', example: 'co_star_comp5_example', tooltip: 'costar_audience_tooltip' },
        { id: 'response', label: 'co_star_comp6_label', example: 'co_star_comp6_example', tooltip: 'costar_response_tooltip' },
      ],
      genericToolLinks: mergeAndSortTextToolLinks(),
    },
    enLocale: {
      name: 'co_star_name',
      shortName: 'co_star_shortName',
      description: 'co_star_description',
      shortDescription: 'co_star_short_desc',
      category: 'text',
      components: [
        { id: 'context', label: 'co_star_comp1_label', example: 'co_star_comp1_example', tooltip: 'costar_context_tooltip' },
        { id: 'objective', label: 'co_star_comp2_label', example: 'co_star_comp2_example', tooltip: 'costar_objective_tooltip' },
        { id: 'style', label: 'co_star_comp3_label', example: 'co_star_comp3_example', tooltip: 'costar_style_tooltip' },
        { id: 'tone', label: 'co_star_comp4_label', example: 'co_star_comp4_example', tooltip: 'costar_tone_tooltip' },
        { id: 'audience', label: 'co_star_comp5_label', example: 'co_star_comp5_example', tooltip: 'costar_audience_tooltip' },
        { id: 'response', label: 'co_star_comp6_label', example: 'co_star_comp6_example', tooltip: 'costar_response_tooltip' },
      ],
      genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },
  {
    id: 'rtf-c',
    idLocale: {
      name: 'rtf_c_name',
      shortName: 'rtf_c_shortName',
      description: 'rtf_c_description',
      shortDescription: 'rtf_c_short_desc',
      category: 'text',
      components: [
        { id: 'role', label: 'rtf_c_role_label', example: 'rtf_c_role_example', tooltip: 'rtfc_role_tooltip' },
        { id: 'task', label: 'rtf_c_task_label', example: 'rtf_c_task_example', tooltip: 'rtfc_task_tooltip' },
        { id: 'format', label: 'rtf_c_format_label', example: 'rtf_c_format_example', tooltip: 'rtfc_format_tooltip' },
        { id: 'context', label: 'rtf_c_context_label', example: 'rtf_c_context_example', tooltip: 'rtfc_context_tooltip' },
      ],
      genericToolLinks: mergeAndSortTextToolLinks(),
    },
    enLocale: {
      name: 'rtf_c_name',
      shortName: 'rtf_c_shortName',
      description: 'rtf_c_description',
      shortDescription: 'rtf_c_short_desc',
      category: 'text',
      components: [
        { id: 'role', label: 'rtf_c_role_label', example: 'rtf_c_role_example', tooltip: 'rtfc_role_tooltip' },
        { id: 'task', label: 'rtf_c_task_label', example: 'rtf_c_task_example', tooltip: 'rtfc_task_tooltip' },
        { id: 'format', label: 'rtf_c_format_label', example: 'rtf_c_format_example', tooltip: 'rtfc_format_tooltip' },
        { id: 'context', label: 'rtf_c_context_label', example: 'rtf_c_context_example', tooltip: 'rtfc_context_tooltip' },
      ],
      genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },
  {
    id: 'smart',
    idLocale: {
      name: 'smart_name',
      shortName: 'smart_shortName',
      description: 'smart_description',
      shortDescription: 'smart_short_desc',
      category: 'text',
      components: [
        { id: 'specific', label: 'smart_specific_label', example: 'smart_specific_example', tooltip: 'smart_specific_tooltip' },
        { id: 'measurable', label: 'smart_measurable_label', example: 'smart_measurable_example', tooltip: 'smart_measurable_tooltip' },
        { id: 'achievable', label: 'smart_achievable_label', example: 'smart_achievable_example', tooltip: 'smart_achievable_tooltip' },
        { id: 'relevant', label: 'smart_relevant_label', example: 'smart_relevant_example', tooltip: 'smart_relevant_tooltip' },
        { id: 'time', label: 'smart_time_label', example: 'smart_time_example', tooltip: 'smart_time_tooltip' },
      ],
      genericToolLinks: mergeAndSortTextToolLinks(),
    },
    enLocale: {
      name: 'smart_name',
      shortName: 'smart_shortName',
      description: 'smart_description',
      shortDescription: 'smart_short_desc',
      category: 'text',
      components: [
        { id: 'specific', label: 'smart_specific_label', example: 'smart_specific_example', tooltip: 'smart_specific_tooltip' },
        { id: 'measurable', label: 'smart_measurable_label', example: 'smart_measurable_example', tooltip: 'smart_measurable_tooltip' },
        { id: 'achievable', label: 'smart_achievable_label', example: 'smart_achievable_example', tooltip: 'smart_achievable_tooltip' },
        { id: 'relevant', label: 'smart_relevant_label', example: 'smart_relevant_example', tooltip: 'smart_relevant_tooltip' },
        { id: 'time', label: 'smart_time_label', example: 'smart_time_example', tooltip: 'smart_time_tooltip' },
      ],
      genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },
  {
    id: 'tag',
    idLocale: {
      name: 'tag_name',
      shortName: 'tag_shortName',
      description: 'tag_description',
      shortDescription: 'tag_short_desc',
      category: 'text',
      components: [
        { id: 'task', label: 'tag_task_label', example: 'tag_task_example', tooltip: 'tag_task_tooltip' },
        { id: 'action', label: 'tag_action_label', example: 'tag_action_example', tooltip: 'tag_action_tooltip' },
        { id: 'goal', label: 'tag_goal_label', example: 'tag_goal_example', tooltip: 'tag_goal_tooltip' },
      ],
      genericToolLinks: mergeAndSortTextToolLinks(),
    },
    enLocale: {
      name: 'tag_name',
      shortName: 'tag_shortName',
      description: 'tag_description',
      shortDescription: 'tag_short_desc',
      category: 'text',
      components: [
        { id: 'task', label: 'tag_task_label', example: 'tag_task_example', tooltip: 'tag_task_tooltip' },
        { id: 'action', label: 'tag_action_label', example: 'tag_action_example', tooltip: 'tag_action_tooltip' },
        { id: 'goal', label: 'tag_goal_label', example: 'tag_goal_example', tooltip: 'tag_goal_tooltip' },
      ],
      genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },
  {
    id: 'bab',
    idLocale: {
      name: 'bab_name',
      shortName: 'bab_shortName',
      description: 'bab_description',
      shortDescription: 'bab_short_desc',
      category: 'text',
      components: [
        { id: 'before', label: 'bab_before_label', example: 'bab_before_example', tooltip: 'bab_before_tooltip' },
        { id: 'after', label: 'bab_after_label', example: 'bab_after_example', tooltip: 'bab_after_tooltip' },
        { id: 'bridge', label: 'bab_bridge_label', example: 'bab_bridge_example', tooltip: 'bab_bridge_tooltip' },
      ],
      genericToolLinks: mergeAndSortTextToolLinks(),
    },
    enLocale: {
      name: 'bab_name',
      shortName: 'bab_shortName',
      description: 'bab_description',
      shortDescription: 'bab_short_desc',
      category: 'text',
      components: [
        { id: 'before', label: 'bab_before_label', example: 'bab_before_example', tooltip: 'bab_before_tooltip' },
        { id: 'after', label: 'bab_after_label', example: 'bab_after_example', tooltip: 'bab_after_tooltip' },
        { id: 'bridge', label: 'bab_bridge_label', example: 'bab_bridge_example', tooltip: 'bab_bridge_tooltip' },
      ],
      genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },
  {
    id: 'risen',
    idLocale: {
      name: 'risen_name',
      shortName: 'risen_shortName',
      description: 'risen_description',
      shortDescription: 'risen_short_desc',
      category: 'text',
      components: [
        { id: 'role', label: 'risen_role_label', example: 'risen_role_example', tooltip: 'risen_role_tooltip' },
        { id: 'input', label: 'risen_input_label', example: 'risen_input_example', tooltip: 'risen_input_tooltip' },
        { id: 'steps', label: 'risen_steps_label', example: 'risen_steps_example', tooltip: 'risen_steps_tooltip' },
        { id: 'expectation', label: 'risen_expectation_label', example: 'risen_expectation_example', tooltip: 'risen_expectation_tooltip' },
        { id: 'narrowing', label: 'risen_narrowing_label', example: 'risen_narrowing_example', tooltip: 'risen_narrowing_tooltip' },
      ],
      genericToolLinks: mergeAndSortTextToolLinks(),
    },
    enLocale: {
      name: 'risen_name',
      shortName: 'risen_shortName',
      description: 'risen_description',
      shortDescription: 'risen_short_desc',
      category: 'text',
      components: [
        { id: 'role', label: 'risen_role_label', example: 'risen_role_example', tooltip: 'risen_role_tooltip' },
        { id: 'input', label: 'risen_input_label', example: 'risen_input_example', tooltip: 'risen_input_tooltip' },
        { id: 'steps', label: 'risen_steps_label', example: 'risen_steps_example', tooltip: 'risen_steps_tooltip' },
        { id: 'expectation', label: 'risen_expectation_label', example: 'risen_expectation_example', tooltip: 'risen_expectation_tooltip' },
        { id: 'narrowing', label: 'risen_narrowing_label', example: 'risen_narrowing_example', tooltip: 'risen_narrowing_tooltip' },
      ],
      genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },
  {
    id: 'cot',
    idLocale: {
      name: 'cot_name',
      shortName: 'cot_shortName',
      description: 'cot_description',
      shortDescription: 'cot_short_desc',
      category: 'text',
      components: [
        { id: 'problem', label: 'cot_problem_label', example: 'cot_problem_example', tooltip: 'cot_problem_tooltip' },
        { id: 'reasoning', label: 'cot_reasoning_label', example: 'cot_reasoning_example', tooltip: 'cot_reasoning_tooltip' },
        { id: 'output', label: 'cot_output_label', example: 'cot_output_example', tooltip: 'cot_output_tooltip' },
      ],
      genericToolLinks: mergeAndSortTextToolLinks(),
    },
    enLocale: {
      name: 'cot_name',
      shortName: 'cot_shortName',
      description: 'cot_description',
      shortDescription: 'cot_short_desc',
      category: 'text',
      components: [
        { id: 'problem', label: 'cot_problem_label', example: 'cot_problem_example', tooltip: 'cot_problem_tooltip' },
        { id: 'reasoning', label: 'cot_reasoning_label', example: 'cot_reasoning_example', tooltip: 'cot_reasoning_tooltip' },
        { id: 'output', label: 'cot_output_label', example: 'cot_output_example', tooltip: 'cot_output_tooltip' },
      ],
      genericToolLinks: mergeAndSortTextToolLinks(),
    }
  },

  // ==========================================
  // --- 2. MEDIA FRAMEWORKS (IMAGE & VIDEO) ---
  // ==========================================
  {
    id: 'selsc',
    idLocale: {
      name: 'selsc_name',
      shortName: 'selsc_shortName',
      description: 'selsc_description',
      shortDescription: 'selsc_short_desc',
      category: 'media',
      components: [
        { id: 'subject', label: 'selsc_subject_label', example: 'selsc_subject_example', tooltip: 'selsc_subject_tooltip' },
        { id: 'environment', label: 'selsc_environment_label', example: 'selsc_environment_example', tooltip: 'selsc_environment_tooltip' },
        { id: 'lighting', label: 'selsc_lighting_label', example: 'selsc_lighting_example', tooltip: 'selsc_lighting_tooltip' },
        { id: 'style', label: 'selsc_style_label', example: 'selsc_style_example', tooltip: 'selsc_style_tooltip' },
        { id: 'camera', label: 'selsc_camera_label', example: 'selsc_camera_example', tooltip: 'selsc_camera_tooltip' },
      ],
      genericToolLinks: standardImageVideoAlternatives,
    },
    enLocale: {
      name: 'selsc_name',
      shortName: 'selsc_shortName',
      description: 'selsc_description',
      shortDescription: 'selsc_short_desc',
      category: 'media',
      components: [
        { id: 'subject', label: 'selsc_subject_label', example: 'selsc_subject_example', tooltip: 'selsc_subject_tooltip' },
        { id: 'environment', label: 'selsc_environment_label', example: 'selsc_environment_example', tooltip: 'selsc_environment_tooltip' },
        { id: 'lighting', label: 'selsc_lighting_label', example: 'selsc_lighting_example', tooltip: 'selsc_lighting_tooltip' },
        { id: 'style', label: 'selsc_style_label', example: 'selsc_style_example', tooltip: 'selsc_style_tooltip' },
        { id: 'camera', label: 'selsc_camera_label', example: 'selsc_camera_example', tooltip: 'selsc_camera_tooltip' },
      ],
      genericToolLinks: standardImageVideoAlternatives,
    }
  },
  {
    id: 'vpma',
    idLocale: {
      name: 'vpma_name',
      shortName: 'vpma_shortName',
      description: 'vpma_description',
      shortDescription: 'vpma_short_desc',
      category: 'media',
      components: [
        { id: 'subject_action', label: 'vpma_subject_action_label', example: 'vpma_subject_action_example', tooltip: 'vpma_subject_action_tooltip' },
        { id: 'camera_motion', label: 'vpma_camera_motion_label', example: 'vpma_camera_motion_example', tooltip: 'vpma_camera_motion_tooltip' },
        { id: 'atmosphere', label: 'vpma_atmosphere_label', example: 'vpma_atmosphere_example', tooltip: 'vpma_atmosphere_tooltip' },
        { id: 'pacing', label: 'vpma_pacing_label', example: 'vpma_pacing_example', tooltip: 'vpma_pacing_tooltip' },
      ],
      genericToolLinks: standardImageVideoAlternatives,
    },
    enLocale: {
      name: 'vpma_name',
      shortName: 'vpma_shortName',
      description: 'vpma_description',
      shortDescription: 'vpma_short_desc',
      category: 'media',
      components: [
        { id: 'subject_action', label: 'vpma_subject_action_label', example: 'vpma_subject_action_example', tooltip: 'vpma_subject_action_tooltip' },
        { id: 'camera_motion', label: 'vpma_camera_motion_label', example: 'vpma_camera_motion_example', tooltip: 'vpma_camera_motion_tooltip' },
        { id: 'atmosphere', label: 'vpma_atmosphere_label', example: 'vpma_atmosphere_example', tooltip: 'vpma_atmosphere_tooltip' },
        { id: 'pacing', label: 'vpma_pacing_label', example: 'vpma_pacing_example', tooltip: 'vpma_pacing_tooltip' },
      ],
      genericToolLinks: standardImageVideoAlternatives,
    }
  },
  {
    id: 'neg_prompt',
    idLocale: {
      name: 'neg_name',
      shortName: 'neg_shortName',
      description: 'neg_description',
      shortDescription: 'neg_short_desc',
      category: 'media',
      components: [
        { id: 'quality', label: 'neg_quality_label', example: 'neg_quality_example', tooltip: 'neg_quality_tooltip' },
        { id: 'anatomy', label: 'neg_anatomy_label', example: 'neg_anatomy_example', tooltip: 'neg_anatomy_tooltip' },
        { id: 'composition', label: 'neg_composition_label', example: 'neg_composition_example', tooltip: 'neg_composition_tooltip' },
      ],
      genericToolLinks: standardImageVideoAlternatives,
    },
    enLocale: {
      name: 'neg_name',
      shortName: 'neg_shortName',
      description: 'neg_description',
      shortDescription: 'neg_short_desc',
      category: 'media',
      components: [
        { id: 'quality', label: 'neg_quality_label', example: 'neg_quality_example', tooltip: 'neg_quality_tooltip' },
        { id: 'anatomy', label: 'neg_anatomy_label', example: 'neg_anatomy_example', tooltip: 'neg_anatomy_tooltip' },
        { id: 'composition', label: 'neg_composition_label', example: 'neg_composition_example', tooltip: 'neg_composition_tooltip' },
      ],
      genericToolLinks: standardImageVideoAlternatives,
    }
  },

  // ==========================================
  // --- 3. MUSIC & AUDIO FRAMEWORKS ---
  // ==========================================
  {
    id: 'gmis',
    idLocale: {
      name: 'gmis_name',
      shortName: 'gmis_shortName',
      description: 'gmis_description',
      shortDescription: 'gmis_short_desc',
      category: 'music',
      components: [
        { id: 'genre', label: 'gmis_genre_label', example: 'gmis_genre_example', tooltip: 'gmis_genre_tooltip' },
        { id: 'mood', label: 'gmis_mood_label', example: 'gmis_mood_example', tooltip: 'gmis_mood_tooltip' },
        { id: 'instruments', label: 'gmis_instruments_label', example: 'gmis_instruments_example', tooltip: 'gmis_instruments_tooltip' },
        { id: 'structure', label: 'gmis_structure_label', example: 'gmis_structure_example', tooltip: 'gmis_structure_tooltip' },
      ],
      genericToolLinks: standardMusicAlternatives,
    },
    enLocale: {
      name: 'gmis_name',
      shortName: 'gmis_shortName',
      description: 'gmis_description',
      shortDescription: 'gmis_short_desc',
      category: 'music',
      components: [
        { id: 'genre', label: 'gmis_genre_label', example: 'gmis_genre_example', tooltip: 'gmis_genre_tooltip' },
        { id: 'mood', label: 'gmis_mood_label', example: 'gmis_mood_example', tooltip: 'gmis_mood_tooltip' },
        { id: 'instruments', label: 'gmis_instruments_label', example: 'gmis_instruments_example', tooltip: 'gmis_instruments_tooltip' },
        { id: 'structure', label: 'gmis_structure_label', example: 'gmis_structure_example', tooltip: 'gmis_structure_tooltip' },
      ],
      genericToolLinks: standardMusicAlternatives,
    }
  },
  {
    id: 'vtp',
    idLocale: {
      name: 'vtp_name',
      shortName: 'vtp_shortName',
      description: 'vtp_description',
      shortDescription: 'vtp_short_desc',
      category: 'music',
      components: [
        { id: 'vocal', label: 'vtp_vocal_label', example: 'vtp_vocal_example', tooltip: 'vtp_vocal_tooltip' },
        { id: 'tempo', label: 'vtp_tempo_label', example: 'vtp_tempo_example', tooltip: 'vtp_tempo_tooltip' },
        { id: 'production', label: 'vtp_production_label', example: 'vtp_production_example', tooltip: 'vtp_production_tooltip' },
      ],
      genericToolLinks: standardMusicAlternatives,
    },
    enLocale: {
      name: 'vtp_name',
      shortName: 'vtp_shortName',
      description: 'vtp_description',
      shortDescription: 'vtp_short_desc',
      category: 'music',
      components: [
        { id: 'vocal', label: 'vtp_vocal_label', example: 'vtp_vocal_example', tooltip: 'vtp_vocal_tooltip' },
        { id: 'tempo', label: 'vtp_tempo_label', example: 'vtp_tempo_example', tooltip: 'vtp_tempo_tooltip' },
        { id: 'production', label: 'vtp_production_label', example: 'vtp_production_example', tooltip: 'vtp_production_tooltip' },
      ],
      genericToolLinks: standardMusicAlternatives,
    }
  }
];
