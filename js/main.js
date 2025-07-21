const CONSTANTS = {
    DISPLAY_TIMEOUT: 100, EMPLOYMENT_STATUS: {
        EMPLOYED: 1, UNEMPLOYED: 2, NOT_PARTICIPATING: 3
    }, IS_STUDYING: 'Đi học', MIN_AGE: 15
};

function getElement(id) {
    return document.getElementById(id);
}

function getElementValue(id, defaultValue = '') {
    const element = getElement(id);
    return element ? element.value : defaultValue;
}

function getElementChecked(id, defaultValue = false) {
    const element = getElement(id);
    return element ? element.checked : defaultValue;
}

function isElementVisible(element) {
    if (!element) return false;
    if (window.getComputedStyle(element).display === 'none') return false;
    let parent = element.parentElement;
    while (parent) {
        if (window.getComputedStyle(parent).display === 'none') return false;
        parent = parent.parentElement;
    }
    return true;
}

function toggleEthnicityField() {
    const ethnicCheckbox = getElement('dan_toc');
    const ethnicField = getElement('dan_toc_ten');
    const tenDanToc = getElement('ten_dan_toc');
    if (ethnicCheckbox && ethnicField && tenDanToc) {
        ethnicField.style.display = ethnicCheckbox.checked ? 'block' : 'none';
        tenDanToc.required = ethnicCheckbox.checked;
    }
}

function toggleEmploymentDetails() {
    const statusSelect = getElement('tinh_trang_viec_lam');
    if (!statusSelect) return;
    const status = statusSelect.value;
    const sections = {
        'employed-section': status === CONSTANTS.EMPLOYMENT_STATUS.EMPLOYED,
        'unemployed-section': status === CONSTANTS.EMPLOYMENT_STATUS.UNEMPLOYED,
        'not-participating-section': status === CONSTANTS.EMPLOYMENT_STATUS.NOT_PARTICIPATING
    };
    Object.entries(sections).forEach(([sectionId, shouldShow]) => {
        const section = getElement(sectionId);
        if (section) {
            section.style.display = shouldShow ? 'block' : 'none';
        }
    });
    const studyFields = getElement('study-fields');
    if (studyFields) {
        studyFields.style.display = 'none';
    }
    setTimeout(() => {
        let focusElement = null;
        if (status === CONSTANTS.EMPLOYMENT_STATUS.EMPLOYED) {
            focusElement = getElement('vi_tri_viec_lam');
        } else if (status === CONSTANTS.EMPLOYMENT_STATUS.UNEMPLOYED) {
            focusElement = getElement('thoi_gian_that_nghiep');
        } else if (status === CONSTANTS.EMPLOYMENT_STATUS.NOT_PARTICIPATING) {
            focusElement = getElement('ly_do');
        }
        if (focusElement) {
            focusElement.focus();
        }
    }, CONSTANTS.DISPLAY_TIMEOUT);
}

function toggleStudyFields() {
    const reasonSelect = getElement('ly_do');
    const studyFields = getElement('study-fields');
    if (!reasonSelect || !studyFields) {
        return;
    }
    const isStudying = reasonSelect.value === CONSTANTS.IS_STUDYING;
    studyFields.style.display = isStudying ? 'block' : 'none';
    const studyInputs = studyFields.querySelectorAll('input, select');
    studyInputs.forEach(input => {
        input.required = isStudying;
    });
    if (isStudying) {
        setTimeout(() => {
            const firstField = getElement('trinh_do_dao_tao');
            if (firstField) {
                firstField.focus();
            }
        }, CONSTANTS.DISPLAY_TIMEOUT);
    }
}

function deleteEmployee() {
    if (confirm('Bạn có muốn xóa?')) {
        alert('Xóa thành công');
        resetForm();
    }
}

function validateField(field, validationFn) {
    if (!field || !isElementVisible(field)) {
        return true;
    }
    const isValid = validationFn(field);
    if (isValid) {
        field.classList.remove('is-invalid');
    } else {
        field.classList.add('is-invalid');
    }
    return isValid;
}

function validateRequiredTextField(field) {
    return field.value.trim() !== '';
}

function validateRequiredSelectField(field) {
    return field.value !== '';
}

function validateMinimumAge(dateField, minAge) {
    if (!dateField.value) {
        return false;
    }
    const birthDate = new Date(dateField.value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    return age > minAge || (age === minAge && monthDiff >= 0);
}

function validateFutureDate(dateField) {
    if (!dateField.value) {
        return false;
    }
    const selectedDate = new Date(dateField.value);
    const today = new Date();
    return selectedDate > today;
}

function validateIdCard(field) {
    return field.value.match(/^\d{12}$/);
}

function validatePermanentAddress() {
    const fields = [{id: 'thuong_tru_tinh', validator: validateRequiredTextField}, {
        id: 'thuong_tru_phuongxa',
        validator: validateRequiredTextField
    }, {id: 'thuong_tru_diachichitiet', validator: validateRequiredTextField}];
    return fields.every(({id, validator}) => {
        const field = getElement(id);
        return validateField(field, validator);
    });
}

function validateEthnicity() {
    const danTocCheckbox = getElement('dan_toc');
    const tenDanToc = getElement('ten_dan_toc');
    const danTocField = getElement('dan_toc_ten');
    if (!isElementVisible(danTocField) || !danTocCheckbox?.checked) {
        return true;
    }
    return validateField(tenDanToc, validateRequiredTextField);
}

function validateEmployedSection() {
    const employedSection = getElement('employed-section');
    if (!isElementVisible(employedSection)) {
        return true;
    }
    const fields = [{id: 'vi_tri_viec_lam', validator: validateRequiredSelectField}, {
        id: 'cong_viec',
        validator: validateRequiredSelectField
    }, {id: 'noi_lam_viec', validator: validateRequiredTextField}, {
        id: 'lam_viec_tinh',
        validator: validateRequiredTextField
    }, {id: 'lam_viec_phuongxa', validator: validateRequiredTextField}, {
        id: 'lam_viec_diachichitiet',
        validator: validateRequiredTextField
    }];
    return fields.every(({id, validator}) => {
        const field = getElement(id);
        return validateField(field, validator);
    });
}

function validateUnemployedSection() {
    const unemployedSection = getElement('unemployed-section');
    if (!isElementVisible(unemployedSection)) {
        return true;
    }
    const fields = [{id: 'thoi_gian_that_nghiep', validator: validateRequiredSelectField}, {
        id: 'nhu_cau_viec_lam',
        validator: validateRequiredTextField
    }];
    return fields.every(({id, validator}) => {
        const field = getElement(id);
        return validateField(field, validator);
    });
}

function validateStudyFields(lyDo) {
    if (lyDo.value !== CONSTANTS.IS_STUDYING) {
        return true;
    }
    const studyFields = getElement('study-fields');
    if (!isElementVisible(studyFields)) {
        return true;
    }
    const fields = [{id: 'trinh_do_dao_tao', validator: validateRequiredSelectField}, {
        id: 'chuyen_nganh_dao_tao',
        validator: validateRequiredSelectField
    }, {id: 'ngay_tot_nghiep', validator: validateFutureDate}];
    return fields.every(({id, validator}) => {
        const field = getElement(id);
        return validateField(field, validator);
    });
}

function validateNotParticipatingSection() {
    const notParticipatingSection = getElement('not-participating-section');
    if (!isElementVisible(notParticipatingSection)) {
        return true;
    }
    const lyDo = getElement('ly_do');
    const isReasonValid = validateField(lyDo, validateRequiredSelectField);
    if (!isReasonValid) {
        return false;
    }
    return validateStudyFields(lyDo);
}

function collectPersonalInfo() {
    return {
        ho_ten: getElementValue('ho_ten'),
        ngay_sinh: getElementValue('ngay_sinh'),
        gioi_tinh: getElementValue('gioi_tinh'),
        cccd: getElementValue('cccd')
    };
}

function collectAddressInfo(prefix) {
    return {
        tinh: getElementValue(`${prefix}_tinh`),
        phuong_xa: getElementValue(`${prefix}_phuongxa`),
        dia_chi_chi_tiet: getElementValue(`${prefix}_diachichitiet`)
    };
}

function collectPriorityInfo() {
    const danTocChecked = getElementChecked('dan_toc');
    return {
        khuyt_tat: getElementChecked('khuyt_tat'),
        ho_ngheo: getElementChecked('ho_ngheo'),
        dan_toc: danTocChecked,
        ten_dan_toc: danTocChecked ? getElementValue('ten_dan_toc') : ''
    };
}

function collectEmployedInfo() {
    const employedInfo = {
        vi_tri: getElementValue('vi_tri_viec_lam'),
        noi_lam_viec: getElementValue('noi_lam_viec'),
        cong_viec: getElementValue('cong_viec')
    };
    const workLocationFields = ['lam_viec_tinh', 'lam_viec_phuongxa', 'lam_viec_diachichitiet'];
    const hasWorkLocation = workLocationFields.every(id => getElement(id));
    if (hasWorkLocation) {
        employedInfo.dia_chi = {
            tinh: getElementValue('lam_viec_tinh'),
            phuong_xa: getElementValue('lam_viec_phuongxa'),
            dia_chi_chi_tiet: getElementValue('lam_viec_diachichitiet')
        };
    }
    return employedInfo;
}

function collectUnemployedInfo() {
    return {
        thoi_gian: getElementValue('thoi_gian_that_nghiep'),
        nhu_cau: getElementValue('nhu_cau_viec_lam'),
        da_tung_lam_viec: getElementChecked('da_tung_lam_viec')
    };
}

function collectStudyInfo() {
    return {
        trinh_do: getElementValue('trinh_do_dao_tao'),
        chuyen_nganh: getElementValue('chuyen_nganh_dao_tao'),
        ngay_tot_nghiep: getElementValue('ngay_tot_nghiep')
    };
}

function collectNotParticipatingInfo() {
    const lyDo = getElementValue('ly_do');
    const notParticipatingInfo = {
        ly_do: lyDo
    };
    if (lyDo === CONSTANTS.IS_STUDYING) {
        notParticipatingInfo.hoc_tap = collectStudyInfo();
    }
    return notParticipatingInfo;
}

function collectFormData() {
    const employmentStatus = getElementValue('tinh_trang_viec_lam');
    const formData = {
        ...collectPersonalInfo(),
        thuong_tru: collectAddressInfo('thuong_tru'),
        tam_tru: collectAddressInfo('tam_tru'),
        doi_tuong_uu_tien: collectPriorityInfo(),
        tinh_trang_viec_lam: employmentStatus
    };
    if (employmentStatus === CONSTANTS.EMPLOYMENT_STATUS.EMPLOYED) {
        formData.viec_lam = collectEmployedInfo();
    } else if (employmentStatus === CONSTANTS.EMPLOYMENT_STATUS.UNEMPLOYED) {
        formData.that_nghiep = collectUnemployedInfo();
    } else if (employmentStatus === CONSTANTS.EMPLOYMENT_STATUS.NOT_PARTICIPATING) {
        formData.khong_tham_gia = collectNotParticipatingInfo();
    }
    return formData;
}

function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const hiddenInputs = form.querySelectorAll('input, select, textarea');
    hiddenInputs.forEach(input => {
        if (!isElementVisible(input)) {
            input.setAttribute('data-required', input.required);
            input.required = false;
        }
    });
    let isValid = form.checkValidity();
    hiddenInputs.forEach(input => {
        if (input.hasAttribute('data-required')) {
            input.required = input.getAttribute('data-required') === 'true';
            input.removeAttribute('data-required');
        }
    });
    const validations = [{
        field: getElement('ho_ten'),
        validator: validateRequiredTextField
    }, {
        field: getElement('ngay_sinh'),
        validator: field => validateMinimumAge(field, CONSTANTS.MIN_AGE)
    }, {
        field: getElement('cccd'),
        validator: validateIdCard
    }, {section: validatePermanentAddress}, {section: validateEthnicity}];
    const status = getElementValue('tinh_trang_viec_lam');
    if (status === CONSTANTS.EMPLOYMENT_STATUS.EMPLOYED) {
        validations.push({section: validateEmployedSection});
    } else if (status === CONSTANTS.EMPLOYMENT_STATUS.UNEMPLOYED) {
        validations.push({section: validateUnemployedSection});
    } else if (status === CONSTANTS.EMPLOYMENT_STATUS.NOT_PARTICIPATING) {
        validations.push({section: validateNotParticipatingSection});
    }
    validations.forEach(validation => {
        if (validation.field && validation.validator) {
            isValid = validateField(validation.field, validation.validator) && isValid;
        } else if (validation.section) {
            isValid = validation.section() && isValid;
        }
    });
    if (isValid) {
        const formData = collectFormData();
        displayFormData(formData);
        resetForm();
    } else {
        form.classList.add('was-validated');
        focusFirstInvalidField(form);
    }
}

function displayFormData(formData) {
    const jsonOutput = JSON.stringify(formData, null, 2);
    const outputElement = getElement('jsonOutput');
    if (outputElement) {
        outputElement.textContent = jsonOutput;
    }
    console.log('Form data:', formData);
    const modal = new bootstrap.Modal(getElement('jsonModal'));
    modal.show();
    alert('Lưu thành công!');
}

function resetForm() {
    const form = getElement('laborForm');
    if (!form) {
        return;
    }
    form.classList.remove('was-validated');
    const invalidInputs = form.querySelectorAll('.is-invalid');
    invalidInputs.forEach(input => {
        input.classList.remove('is-invalid');
    });
    form.reset();
    toggleEmploymentDetails();
    toggleEthnicityField();
    const firstField = getElement('ho_ten');
    if (firstField) {
        firstField.focus();
    }
}

function focusFirstInvalidField(form) {
    const firstInvalid = form.querySelector('.is-invalid');
    if (firstInvalid) {
        firstInvalid.focus();
    }
}

function initializeApp() {
    const firstField = getElement('ho_ten');
    if (firstField) {
        firstField.focus();
    }
    const form = getElement('laborForm');
    if (form) {
        form.addEventListener('input', toggleEmploymentDetails);
        form.addEventListener('change', toggleEmploymentDetails);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
    const form = getElement('laborForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});
