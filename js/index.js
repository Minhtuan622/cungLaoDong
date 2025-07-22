// Dữ liệu giả lập
let laborData = [
    {id: 1, ho_ten: "Nguyễn Văn A", cccd: "123456789012", ngay_sinh: "01/01/1990", tinh_trang_viec_lam: "Có việc làm"},
    {id: 2, ho_ten: "Trần Thị B", cccd: "987654321098", ngay_sinh: "15/05/1995", tinh_trang_viec_lam: "Thất nghiệp"},
    {id: 3, ho_ten: "Lê Văn C", cccd: "456789123456", ngay_sinh: "20/10/2000", tinh_trang_viec_lam: "Không tham gia"},
    {id: 4, ho_ten: "Phạm Thị D", cccd: "789123456789", ngay_sinh: "05/03/1985", tinh_trang_viec_lam: "Có việc làm"},
    {id: 5, ho_ten: "Hoàng Văn E", cccd: "321654987123", ngay_sinh: "12/12/1992", tinh_trang_viec_lam: "Thất nghiệp"},
    {id: 6, ho_ten: "Đặng Thị F", cccd: "654321987654", ngay_sinh: "30/07/1998", tinh_trang_viec_lam: "Không tham gia"}
];

function displayLaborList(page = 1) {
    const itemsPerPage = 5;
    const $laborTable = $('#laborTable');
    $laborTable.html('');
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedData = laborData.slice(start, end);

    paginatedData.forEach((labor, index) => {
        $laborTable.append(`
            <tr>
                <td>${start + index + 1}</td>
                <td>${labor.ho_ten}</td>
                <td>${labor.cccd}</td>
                <td>${labor.ngay_sinh}</td>
                <td>${labor.tinh_trang_viec_lam}</td>
                <td>
                    <div class="dropdown">
                        <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-list"></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#"><i class="bi bi-eye me-1"></i> Xem</a></li>
                            <li><a class="dropdown-item" href="#"><i class="bi bi-pencil me-1"></i> Sửa</a></li>
                            <li><a class="dropdown-item text-danger" href="#"><i class="bi bi-trash me-1"></i> Xóa</a></li>
                        </ul>
                    </div>
                </td>
            </tr>
        `);
    });

    const totalPages = Math.ceil(laborData.length / itemsPerPage);
    const $pagination = $('#pagination');
    $pagination.html('');
    for (let i = 1; i <= totalPages; i++) {
        $pagination.append(`<li class="page-item ${i === page ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`);
    }
}

$(function () {
    displayLaborList();

    $('#searchInput').on('input', function () {
        const query = $(this).val().toLowerCase();
        laborData = laborData.filter(labor =>
            labor.ho_ten.toLowerCase().includes(query) ||
            labor.cccd.includes(query) ||
            labor.tinh_trang_viec_lam.toLowerCase().includes(query)
        );
        displayLaborList();
    });

    $('#pagination').on('click', '.page-link', function (e) {
        e.preventDefault();
        const page = parseInt($(this).data('page'));
        displayLaborList(page);
    });
});