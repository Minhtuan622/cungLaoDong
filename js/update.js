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

function validateCCCD() {
    const cccd = $('#cccd');
    const value = cccd.val().trim();
    const isValid = /^\d{12}$/.test(value);

    cccd[0].setCustomValidity(isValid ? '' : 'Số CCCD không hợp lệ');
    return isValid;
}

function validateAge() {
    const ngaySinh = $('#ngay_sinh');
    const value = ngaySinh.val();
    if (!value) return false;

    const birthDate = new Date(value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    const isValid = age >= 15;
    ngaySinh[0].setCustomValidity(isValid ? '' : 'Người lao động phải từ 15 tuổi trở lên');
    return isValid;
}

$(function () {
    const form = document.getElementById('laborForm');

    $('#cccd').on('input', validateCCCD);
    $('#ngay_sinh').on('input change', validateAge);

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        // TODO: Xử lý gửi form khi hợp lệ
        console.log('Form hợp lệ, chuẩn bị gửi dữ liệu');
    });

    updateSections();
    updateEthnicityField();
    $('#tinh_trang_viec_lam').on('change input', updateSections);
    $('#ly_do').on('change', updateStudyFields);
    $('#dan_toc').on('change', updateEthnicityField);
});

// Dữ liệu giả lập người thân
let familyData = [
    {id: 1, ho_ten: "Nguyễn Thị B", quan_he: "Vợ", ngay_sinh: "15/05/1992", cccd: "987654321098"},
    {id: 2, ho_ten: "Nguyễn Văn C", quan_he: "Con", ngay_sinh: "10/10/2015", cccd: ""}
];

// Hiển thị danh sách người thân
function displayFamilyList() {
    const familyTable = document.getElementById('familyTable');
    familyTable.innerHTML = '';
    familyData.forEach((member, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
                <td>${index + 1}</td>
                <td>${member.ho_ten}</td>
                <td>${member.quan_he}</td>
                <td>${member.ngay_sinh}</td>
                <td>${member.cccd || 'N/A'}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editFamily(${member.id})">Sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteFamily(${member.id})">Xóa</button>
                </td>
            `;
        familyTable.appendChild(row);
    });
}

// Thêm hoặc cập nhật người thân
document.getElementById('familyForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const form = event.target;
    let isValid = form.checkValidity();

    const hoTen = document.getElementById('family_ho_ten');
    const quanHe = document.getElementById('family_quan_he');
    const ngaySinh = document.getElementById('family_ngay_sinh');
    const cccd = document.getElementById('family_cccd');

    // Xác thực họ tên
    if (!hoTen.value.trim()) {
        hoTen.classList.add('is-invalid');
        isValid = false;
    } else {
        hoTen.classList.remove('is-invalid');
    }

    // Xác thực quan hệ
    if (!quanHe.value) {
        quanHe.classList.add('is-invalid');
        isValid = false;
    } else {
        quanHe.classList.remove('is-invalid');
    }

    // Xác thực ngày sinh
    const birthDate = ngaySinh.value;
    if (!ngaySinh.value || !birthDate) {
        ngaySinh.classList.add('is-invalid');
        isValid = false;
    } else {
        ngaySinh.classList.remove('is-invalid');
    }

    // Xác thực CCCD
    if (cccd.value && !cccd.value.match(/^\d{12}$/)) {
        cccd.classList.add('is-invalid');
        isValid = false;
    } else {
        cccd.classList.remove('is-invalid');
    }

    if (isValid) {
        const editId = form.dataset.editId;
        if (editId) {
            const member = familyData.find(m => m.id === parseInt(editId));
            member.ho_ten = hoTen.value;
            member.quan_he = quanHe.value;
            member.ngay_sinh = ngaySinh.value;
            member.cccd = cccd.value;
            form.removeAttribute('data-edit-id');
        } else {
            familyData.push({
                id: familyData.length ? familyData[familyData.length - 1].id + 1 : 1,
                ho_ten: hoTen.value,
                quan_he: quanHe.value,
                ngay_sinh: ngaySinh.value,
                cccd: cccd.value
            });
        }
        alert(editId ? 'Đã cập nhật thông tin người thân!' : 'Đã thêm người thân!');
        resetFamilyForm();
        displayFamilyList();
    } else {
        form.classList.add('was-validated');
    }
});

// Sửa người thân
function editFamily(id) {
    const member = familyData.find(m => m.id === id);
    if (member) {
        document.getElementById('family_ho_ten').value = member.ho_ten;
        document.getElementById('family_quan_he').value = member.quan_he;
        document.getElementById('family_ngay_sinh').value = member.ngay_sinh;
        document.getElementById('family_cccd').value = member.cccd;
        document.getElementById('familyForm').dataset.editId = id;
    }
}

// Xóa người thân
function deleteFamily(id) {
    if (confirm('Xác nhận xóa người thân này?')) {
        familyData = familyData.filter(m => m.id !== id);
        displayFamilyList();
    }
}

// Reset form người thân
function resetFamilyForm() {
    document.getElementById('familyForm').reset();
    document.getElementById('familyForm').classList.remove('was-validated');
    document.getElementById('familyForm').removeAttribute('data-edit-id');
}

// Khởi tạo danh sách người thân
displayFamilyList();
