const STATUS = {EMPLOYED: '1', UNEMPLOYED: '2', NOT_PARTICIPATING: '3'};
const STUDY_REASON = 'Đi học';

function showSection(id, show) {
    $('#' + id).css('display', show ? 'block' : 'none');
}

function updateSections() {
    const status = $('#tinh_trang_viec_lam').val();
    showSection('employed-section', status === STATUS.EMPLOYED);
    showSection('unemployed-section', status === STATUS.UNEMPLOYED);
    showSection('not-participating-section', status === STATUS.NOT_PARTICIPATING);
    showSection('study-fields', false);
    if (status === STATUS.EMPLOYED) $('#vi_tri_viec_lam').focus();
    if (status === STATUS.UNEMPLOYED) $('#thoi_gian_that_nghiep').focus();
    if (status === STATUS.NOT_PARTICIPATING) $('#ly_do').focus();
}

function updateStudyFields() {
    const reason = $('#ly_do').val();
    const show = reason === STUDY_REASON;
    showSection('study-fields', show);
    $('#study-fields').find('input, select').prop('required', show);
    if (show) setTimeout(() => $('#trinh_do_dao_tao').focus(), 100);
}

function updateEthnicityField() {
    const checked = $('#dan_toc').is(':checked');
    showSection('dan_toc_ten', checked);
    $('#ten_dan_toc').prop('required', checked);
}

$(function () {
    updateSections();
    updateEthnicityField();
    $('#tinh_trang_viec_lam').on('change input', updateSections);
    $('#ly_do').on('change', updateStudyFields);
    $('#dan_toc').on('change', updateEthnicityField);
});
