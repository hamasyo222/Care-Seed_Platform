-- Database Schema for Care-Seed Platform

-- ユーザーマスタテーブル
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    user_type VARCHAR(50) NOT NULL, -- 'dx_talent', 'foreign_talent', 'company_admin', 'company_employee', 'support_staff', 'admin'
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'suspended'
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);

-- ユーザープロフィールテーブル
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    first_name_kana VARCHAR(100),
    last_name_kana VARCHAR(100),
    birth_date DATE,
    gender VARCHAR(10), -- 'male', 'female', 'other'
    nationality VARCHAR(3), -- ISO 3166-1 alpha-3
    phone VARCHAR(20),
    address JSONB, -- 住所情報（構造化）
    profile_image_url VARCHAR(500),
    languages JSONB, -- 対応言語・レベル
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 企業情報テーブル
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    name_kana VARCHAR(255),
    industry VARCHAR(100),
    employee_count INTEGER,
    address JSONB,
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(500),
    description TEXT,
    is_specific_skill_certified BOOLEAN DEFAULT false, -- 特定技能受け入れ認定
    certification_number VARCHAR(100), -- 認定番号
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 企業-ユーザー関連テーブル
CREATE TABLE company_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL, -- 'admin', 'hr_manager', 'employee', 'support_staff'
    department VARCHAR(100),
    position VARCHAR(100),
    permissions JSONB, -- 権限設定
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, user_id)
);

-- 権限管理テーブル
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB, -- 権限のJSONリスト
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by UUID REFERENCES users(id),
    UNIQUE(user_id, role_id)
);
-- コンテンツカテゴリテーブル
CREATE TABLE content_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    name_translations JSONB, -- 多言語対応
    description TEXT,
    parent_id UUID REFERENCES content_categories(id),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 学習コンテンツテーブル
CREATE TABLE learning_contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    title_translations JSONB, -- 多言語タイトル
    description TEXT,
    description_translations JSONB,
    category_id UUID REFERENCES content_categories(id),
    content_type VARCHAR(50), -- 'video', 'text', 'quiz', 'interactive'
    difficulty_level VARCHAR(20), -- 'beginner', 'intermediate', 'advanced'
    estimated_duration INTEGER, -- 推定学習時間（分）
    prerequisites JSONB, -- 前提条件のコンテンツID配列
    content_data JSONB, -- コンテンツ固有データ
    file_url VARCHAR(500), -- ファイルのURL
    thumbnail_url VARCHAR(500),
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 学習進捗テーブル
CREATE TABLE learning_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content_id UUID REFERENCES learning_contents(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed', 'skipped'
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    last_accessed_at TIMESTAMP,
    time_spent INTEGER DEFAULT 0, -- 学習時間（秒）
    attempts INTEGER DEFAULT 0, -- 試行回数
    best_score DECIMAL(5,2), -- 最高スコア
    notes TEXT, -- ユーザーメモ
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, content_id)
);

-- クイズ・テストテーブル
CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES learning_contents(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    title_translations JSONB,
    instructions TEXT,
    instructions_translations JSONB,
    time_limit INTEGER, -- 制限時間（秒）
    passing_score DECIMAL(5,2) DEFAULT 70.00,
    max_attempts INTEGER DEFAULT 3,
    shuffle_questions BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 問題テーブル
CREATE TABLE quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_text_translations JSONB,
    question_type VARCHAR(20), -- 'multiple_choice', 'single_choice', 'text', 'file_upload'
    options JSONB, -- 選択肢
    correct_answers JSONB, -- 正解
    explanation TEXT, -- 解説
    explanation_translations JSONB,
    points DECIMAL(5,2) DEFAULT 1.00,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- テスト結果テーブル
CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    score DECIMAL(5,2),
    passed BOOLEAN,
    time_taken INTEGER, -- 所要時間（秒）
    answers JSONB, -- 回答内容
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 証明書テーブル
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content_id UUID REFERENCES learning_contents(id),
    certificate_type VARCHAR(50), -- 'completion', 'achievement', 'skill_certification'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    certificate_url VARCHAR(500), -- PDFファイルのURL
    verification_code VARCHAR(100) UNIQUE,
    metadata JSONB, -- 追加情報
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- DX人材スキルテーブル
CREATE TABLE dx_talent_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skill_category VARCHAR(100), -- 'programming', 'data_analysis', 'ai_ml', 'business_efficiency'
    skill_name VARCHAR(100),
    proficiency_level VARCHAR(20), -- 'beginner', 'intermediate', 'advanced', 'expert'
    years_of_experience DECIMAL(3,1),
    verified BOOLEAN DEFAULT false, -- スキル認証済み
    verified_at TIMESTAMP,
    verified_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 海外人材履歴書テーブル
CREATE TABLE foreign_talent_resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- 基本情報
    native_name VARCHAR(255), -- 母国語名
    romaji_name VARCHAR(255), -- ローマ字名
    katakana_name VARCHAR(255), -- カタカナ名
    birth_place VARCHAR(255), -- 出生地
    
    -- パスポート情報
    passport_number VARCHAR(50),
    passport_issued_date DATE,
    passport_expiry_date DATE,
    passport_issuing_country VARCHAR(3),
    
    -- 在留資格情報
    current_visa_status VARCHAR(100),
    visa_expiry_date DATE,
    entry_history JSONB, -- 出入国歴
    
    -- 身体・健康情報
    height INTEGER, -- cm
    weight INTEGER, -- kg
    blood_type VARCHAR(5),
    dominant_hand VARCHAR(10), -- 'right', 'left'
    vision_left DECIMAL(3,1),
    vision_right DECIMAL(3,1),
    color_vision_normal BOOLEAN,
    health_status VARCHAR(20), -- 'excellent', 'good', 'fair', 'poor'
    medical_conditions TEXT,
    medications TEXT,
    allergies TEXT,
    
    -- 生活習慣
    smoking VARCHAR(20), -- 'never', 'former', 'current'
    drinking VARCHAR(20), -- 'never', 'occasionally', 'regularly'
    has_tattoos BOOLEAN,
    tattoo_details TEXT,
    religion VARCHAR(100),
    dietary_restrictions TEXT,
    
    -- 家族情報
    marital_status VARCHAR(20), -- 'single', 'married', 'divorced', 'widowed'
    spouse_info JSONB, -- 配偶者情報
    children_info JSONB, -- 子供情報
    family_members JSONB, -- 家族構成
    dependents JSONB, -- 扶養家族
    japan_accompaniment JSONB, -- 日本同伴予定
    
    -- 特定技能関連
    desired_skill_fields JSONB, -- 希望分野配列
    skill_test_results JSONB, -- 技能試験結果
    japanese_test_results JSONB, -- 日本語試験結果
    work_preferences JSONB, -- 就労希望条件
    
    -- 志望動機・自己PR
    motivation_for_japan TEXT, -- 日本就労動機
    field_selection_reason TEXT, -- 分野選択理由
    experience_summary TEXT, -- 経験・実績
    strengths TEXT, -- 長所
    weaknesses TEXT, -- 短所
    hobbies TEXT, -- 趣味
    self_introduction TEXT, -- 自己PR
    
    -- 完成度・確認
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,
    is_complete BOOLEAN DEFAULT false,
    completed_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 学歴テーブル
CREATE TABLE education_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    institution_name VARCHAR(255) NOT NULL,
    institution_location VARCHAR(255),
    degree_type VARCHAR(100), -- 'elementary', 'junior_high', 'high_school', 'vocational', 'bachelor', 'master', 'doctorate'
    field_of_study VARCHAR(255),
    start_date DATE,
    end_date DATE,
    graduation_status VARCHAR(20), -- 'graduated', 'current', 'dropped_out'
    gpa DECIMAL(4,2),
    achievements TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 職歴テーブル
CREATE TABLE work_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    company_location VARCHAR(255),
    department VARCHAR(255),
    position VARCHAR(255),
    job_description TEXT,
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    leaving_reason TEXT,
    annual_salary DECIMAL(12,2),
    salary_currency VARCHAR(3),
    skills_used JSONB, -- 使用技術・スキル
    achievements TEXT, -- 実績・成果
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 資格・免許テーブル
CREATE TABLE qualifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    qualification_type VARCHAR(100), -- 'japanese_language', 'skill_test', 'professional', 'other'
    qualification_name VARCHAR(255) NOT NULL,
    issuing_organization VARCHAR(255),
    obtained_date DATE,
    expiry_date DATE,
    score VARCHAR(100), -- スコア・級
    certificate_number VARCHAR(100),
    verification_url VARCHAR(500),
    certificate_file_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 企業求人情報テーブル
CREATE TABLE job_postings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    requirements JSONB, -- 必要スキル・経験
    preferred_qualifications JSONB, -- 歓迎条件
    job_type VARCHAR(50), -- 'full_time', 'part_time', 'contract', 'internship'
    work_location VARCHAR(255),
    salary_min DECIMAL(12,2),
    salary_max DECIMAL(12,2),
    salary_currency VARCHAR(3) DEFAULT 'JPY',
    benefits TEXT,
    specific_skill_field VARCHAR(100), -- 特定技能分野
    japanese_level_required VARCHAR(10), -- 必要日本語レベル
    visa_sponsorship BOOLEAN DEFAULT false,
    application_deadline DATE,
    start_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- マッチングテーブル
CREATE TABLE matching_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    talent_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    job_posting_id UUID REFERENCES job_postings(id),
    matching_type VARCHAR(50), -- 'dx_talent', 'foreign_talent'
    matching_score DECIMAL(5,2), -- AIマッチングスコア
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'company_interested', 'interview_scheduled', 'interviewed', 'hired', 'rejected'
    company_interest_date TIMESTAMP,
    interview_scheduled_date TIMESTAMP,
    interview_completed_date TIMESTAMP,
    decision_date TIMESTAMP,
    rejection_reason TEXT,
    notes TEXT,
    created_by UUID REFERENCES users(id), -- マッチング作成者
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 面談記録テーブル
CREATE TABLE interview_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    matching_id UUID REFERENCES matching_records(id) ON DELETE CASCADE,
    interview_type VARCHAR(50), -- 'initial', 'technical', 'final', 'online', 'in_person'
    scheduled_at TIMESTAMP,
    actual_start_time TIMESTAMP,
    actual_end_time TIMESTAMP,
    interviewer_notes TEXT,
    talent_feedback TEXT,
    company_feedback TEXT,
    evaluation_score DECIMAL(3,1), -- 1-10点評価
    decision VARCHAR(50), -- 'proceed', 'reject', 'on_hold'
    next_steps TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- 雇用契約テーブル
CREATE TABLE employment_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    employee_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    matching_id UUID REFERENCES matching_records(id),
    
    -- 契約基本情報
    contract_type VARCHAR(50), -- 'specific_skill_1', 'specific_skill_2', 'permanent', 'contract'
    contract_number VARCHAR(100) UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE,
    probation_period INTEGER, -- 試用期間（月）
    
    -- 職務情報
    job_title VARCHAR(255),
    department VARCHAR(255),
    work_location VARCHAR(500),
    job_description TEXT,
    specific_skill_field VARCHAR(100), -- 特定技能分野
    
    -- 労働条件
    working_hours_per_week DECIMAL(4,1),
    working_days_per_week INTEGER,
    overtime_allowed BOOLEAN DEFAULT false,
    shift_work BOOLEAN DEFAULT false,
    night_shift_allowed BOOLEAN DEFAULT false,
    
    -- 給与・報酬
    base_salary DECIMAL(12,2),
    salary_type VARCHAR(20), -- 'monthly', 'hourly', 'annual'
    overtime_rate DECIMAL(5,2), -- 残業代率
    allowances JSONB, -- 各種手当
    bonus_structure TEXT,
    
    -- 休暇・福利厚生
    annual_leave_days INTEGER,
    sick_leave_days INTEGER,
    other_benefits TEXT,
    social_insurance JSONB, -- 社会保険
    
    -- 契約状況
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'pending_approval', 'active', 'terminated', 'expired'
    signed_by_employee_at TIMESTAMP,
    signed_by_company_at TIMESTAMP,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    
    -- 書類関連
    contract_file_url VARCHAR(500), -- 契約書PDFのURL
    digital_signature_employee TEXT, -- 従業員のデジタル署名
    digital_signature_company TEXT, -- 企業のデジタル署名
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 在留資格管理テーブル
CREATE TABLE visa_management (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES employment_contracts(id),
    
    -- 現在の在留資格
    current_visa_type VARCHAR(100), -- 在留資格の種類
    current_visa_expiry DATE,
    current_activity_description TEXT,
    
    -- 申請情報
    application_type VARCHAR(50), -- 'change', 'renewal', 'extension'
    application_date DATE,
    application_number VARCHAR(100),
    applied_visa_type VARCHAR(100),
    applied_activity_description TEXT,
    application_reason TEXT,
    
    -- 必要書類
    required_documents JSONB, -- 必要書類リスト
    submitted_documents JSONB, -- 提出済み書類
    document_status VARCHAR(50), -- 'incomplete', 'complete', 'under_review'
    
    -- 審査状況
    review_status VARCHAR(50), -- 'pending', 'under_review', 'approved', 'rejected', 'supplementary_required'
    result_notification_date DATE,
    new_visa_expiry DATE,
    rejection_reason TEXT,
    supplementary_requirements TEXT,
    
    -- 手続きサポート
    support_agent_id UUID REFERENCES users(id), -- 担当サポートスタッフ
    administrative_scrivener_id UUID, -- 行政書士ID（外部）
    application_fee DECIMAL(10,2),
    fee_paid_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 支援計画テーブル
CREATE TABLE support_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES employment_contracts(id),
    
    -- 支援計画基本情報
    plan_type VARCHAR(50), -- 'direct', 'registered_support_organization'
    registered_support_org_id UUID, -- 登録支援機関ID（外部）
    plan_start_date DATE,
    plan_end_date DATE,
    
    -- 法定支援項目
    orientation_completed BOOLEAN DEFAULT false,
    orientation_date DATE,
    
    housing_support_provided BOOLEAN DEFAULT false,
    housing_support_details TEXT,
    
    life_guidance_provided BOOLEAN DEFAULT false,
    life_guidance_frequency VARCHAR(50), -- 'weekly', 'monthly', 'as_needed'
    
    japanese_learning_support BOOLEAN DEFAULT false,
    japanese_learning_details TEXT,
    
    complaint_consultation_available BOOLEAN DEFAULT false,
    consultation_contact_info TEXT,
    
    japanese_contact_support BOOLEAN DEFAULT false,
    contact_support_details TEXT,
    
    non_japanese_contact_support BOOLEAN DEFAULT false,
    non_japanese_support_language VARCHAR(50),
    
    notification_support BOOLEAN DEFAULT false,
    
    career_consultation_available BOOLEAN DEFAULT false,
    
    voluntary_departure_support BOOLEAN DEFAULT false,
    
    -- 実施記録
    support_implementation_records JSONB, -- 支援実施記録
    
    -- 報告書
    quarterly_reports JSONB, -- 四半期報告書
    annual_report TEXT, -- 年次報告書
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 労働管理テーブル
CREATE TABLE work_management (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES employment_contracts(id),
    
    -- 勤務時間管理
    work_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    break_time_minutes INTEGER DEFAULT 0,
    overtime_minutes INTEGER DEFAULT 0,
    work_type VARCHAR(50), -- 'regular', 'overtime', 'holiday', 'sick_leave', 'annual_leave'
    
    -- 評価
    daily_performance_score DECIMAL(3,1), -- 日次パフォーマンス（1-10）
    supervisor_comments TEXT,
    employee_notes TEXT,
    
    -- 出勤状況
    attendance_status VARCHAR(50), -- 'present', 'absent', 'late', 'early_leave'
    late_minutes INTEGER DEFAULT 0,
    early_leave_minutes INTEGER DEFAULT 0,
    absence_reason TEXT,
    
    -- 承認
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_user_id, work_date)
);

-- 給与管理テーブル
CREATE TABLE payroll_management (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES employment_contracts(id),
    
    -- 給与期間
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    pay_date DATE,
    
    -- 基本給与
    base_salary DECIMAL(12,2),
    regular_hours DECIMAL(6,2),
    regular_pay DECIMAL(12,2),
    
    -- 残業・手当
    overtime_hours DECIMAL(6,2) DEFAULT 0,
    overtime_pay DECIMAL(12,2) DEFAULT 0,
    holiday_hours DECIMAL(6,2) DEFAULT 0,
    holiday_pay DECIMAL(12,2) DEFAULT 0,
    allowances JSONB, -- 各種手当の詳細
    
    -- 総支給額
    gross_pay DECIMAL(12,2),
    
    -- 控除
    income_tax DECIMAL(12,2) DEFAULT 0,
    resident_tax DECIMAL(12,2) DEFAULT 0,
    social_insurance_employee DECIMAL(12,2) DEFAULT 0,
    employment_insurance DECIMAL(12,2) DEFAULT 0,
    other_deductions JSONB,
    total_deductions DECIMAL(12,2),
    
    -- 差引支給額
    net_pay DECIMAL(12,2),
    
    -- 支払い状況
    payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'failed'
    payment_method VARCHAR(50), -- 'bank_transfer', 'cash', 'check'
    payment_reference VARCHAR(100),
    
    -- 書類
    payslip_file_url VARCHAR(500),
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- 相談記録テーブル
CREATE TABLE consultation_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    consultation_type VARCHAR(50), -- 'chatbot', 'human_staff', 'video_call'
    category VARCHAR(100), -- 'work', 'life', 'legal', 'cultural', 'emergency'
    subcategory VARCHAR(100),
    
    -- 相談内容
    original_language VARCHAR(10), -- 元の言語
    original_content TEXT, -- 元の相談内容
    translated_content TEXT, -- 翻訳された内容
    
    -- 対応情報
    response_content TEXT, -- 回答内容
    response_language VARCHAR(10),
    response_by VARCHAR(50), -- 'ai_bot', 'human_staff'
    staff_id UUID REFERENCES users(id), -- 対応スタッフ
    
    -- 状況・評価
    urgency_level VARCHAR(20), -- 'low', 'medium', 'high', 'critical'
    status VARCHAR(50) DEFAULT 'open', -- 'open', 'in_progress', 'resolved', 'escalated'
    satisfaction_rating INTEGER, -- 1-5満足度
    resolution_time_minutes INTEGER,
    
    -- フォローアップ
    requires_followup BOOLEAN DEFAULT false,
    followup_date DATE,
    followup_notes TEXT,
    
    -- 企業通知
    company_notified BOOLEAN DEFAULT false,
    company_notification_date TIMESTAMP,
    company_response TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 面談予約・記録テーブル
CREATE TABLE counseling_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES users(id), -- 面談スタッフ
    
    -- 予約情報
    scheduled_at TIMESTAMP NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    session_type VARCHAR(50), -- 'regular', 'emergency', 'followup'
    session_language VARCHAR(10),
    session_method VARCHAR(50), -- 'video_call', 'phone', 'in_person'
    
    -- Zoom情報
    zoom_meeting_id VARCHAR(100),
    zoom_join_url VARCHAR(500),
    zoom_password VARCHAR(100),
    
    -- セッション実施
    actual_start_time TIMESTAMP,
    actual_end_time TIMESTAMP,
    actual_duration_minutes INTEGER,
    
    -- 内容記録
    session_topic VARCHAR(255),
    discussion_points TEXT,
    issues_identified TEXT,
    action_items TEXT,
    next_session_needed BOOLEAN DEFAULT false,
    next_session_date DATE,
    
    -- 評価・フィードバック
    staff_evaluation TEXT, -- スタッフからの評価
    user_satisfaction INTEGER, -- 1-5満足度
    user_feedback TEXT,
    cultural_considerations TEXT, -- 文化的配慮事項
    
    -- 企業向け情報
    company_summary TEXT, -- 企業向け要約
    company_action_required BOOLEAN DEFAULT false,
    company_recommendations TEXT,
    urgency_for_company VARCHAR(20), -- 企業対応の緊急度
    
    -- 状況管理
    status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled', 'no_show'
    cancellation_reason TEXT,
    rescheduled_to TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- レコメンド・生活情報テーブル
CREATE TABLE lifestyle_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- レコメンドタイプ
    recommendation_type VARCHAR(100), -- 'restaurant', 'supermarket', 'medical', 'religious', 'transport', 'service'
    category VARCHAR(100),
    subcategory VARCHAR(100),
    
    -- 事業者情報
    business_name VARCHAR(255),
    business_name_original VARCHAR(255), -- 母国語表記
    address VARCHAR(500),
    phone VARCHAR(20),
    website VARCHAR(500),
    
    -- 営業情報
    opening_hours JSONB, -- 営業時間
    holidays JSONB, -- 定休日
    price_range VARCHAR(50), -- 'budget', 'moderate', 'expensive'
    
    -- 特徴・対応
    features JSONB, -- 特徴・サービス
    language_support JSONB, -- 対応言語
    cultural_considerations JSONB, -- 文化的配慮
    halal_certified BOOLEAN DEFAULT false,
    vegetarian_options BOOLEAN DEFAULT false,
    prayer_space_available BOOLEAN DEFAULT false,
    
    -- 評価・レビュー
    rating DECIMAL(3,2), -- 評価（1-5）
    review_count INTEGER DEFAULT 0,
    user_reviews JSONB, -- ユーザーレビュー
    
    -- パーソナライゼーション
    recommended_score DECIMAL(5,2), -- 個人向け推奨スコア
    recommendation_reasons JSONB, -- 推奨理由
    distance_km DECIMAL(8,2), -- 距離
    
    -- 利用履歴
    viewed_at TIMESTAMP,
    clicked_at TIMESTAMP,
    visited BOOLEAN DEFAULT false,
    user_rating INTEGER, -- ユーザーの評価（1-5）
    user_review TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 多言語スタッフ管理テーブル
CREATE TABLE multilingual_staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- スタッフ情報
    staff_type VARCHAR(50), -- 'counselor', 'consultant', 'emergency_support'
    employment_type VARCHAR(50), -- 'full_time', 'part_time', 'freelance'
    
    -- 対応言語・専門分野
    supported_languages JSONB, -- 対応言語リスト
    specialization_areas JSONB, -- 専門分野
    certifications JSONB, -- 資格・認定
    
    -- 稼働情報
    availability_schedule JSONB, -- 対応可能スケジュール
    max_sessions_per_day INTEGER DEFAULT 8,
    session_duration_minutes INTEGER DEFAULT 60,
    
    -- パフォーマンス
    total_sessions INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2),
    response_time_average INTEGER, -- 平均応答時間（分）
    
    -- ステータス
    is_active BOOLEAN DEFAULT true,
    is_available BOOLEAN DEFAULT true,
    last_active_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
