// src/WebAPI/Controllers/FormDefinitionsController.cs
using Core.Entities;
using Core.Enums;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    // 為了簡化，DTOs暫時省略，直接使用 Entities
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FormDefinitionsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IDynamicTableManager _tableManager;

        public FormDefinitionsController(IUnitOfWork unitOfWork, IDynamicTableManager tableManager)
        {
            _unitOfWork = unitOfWork;
            _tableManager = tableManager;
        }

        [HttpPost]
        public async Task<IActionResult> CreateForm([FromBody] FormDefinition request)
        {
            // 1. 設定對應的實體資料表名稱
            request.UserDataTableName = $"UserData_{request.Name}";

            // 2. 將表單定義寫入元數據資料庫
            await _unitOfWork.FormDefinitions.AddAsync(request);
            await _unitOfWork.CompleteAsync();

            // 3. 呼叫服務，動態建立實體資料表
            try
            {
                await _tableManager.CreateTableForFormAsync(request);
            }
            catch (Exception ex)
            {
                // 如果建表失敗，需要有補償機制 (e.g., 刪除剛才寫入的定義)
                // 這裡暫時簡化，只回傳錯誤
                return BadRequest($"建立實體資料表失敗: {ex.Message}");
            }

            return CreatedAtAction(nameof(GetFormById), new { id = request.Id }, request);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetFormById(Guid id)
        {
            // 在您的 Repository 中實作 GetByIdWithFieldsAsync 方法
            // var form = await _unitOfWork.FormDefinitions.GetByIdWithFieldsAsync(id);
            // if (form == null) return NotFound();
            // return Ok(form);
            return Ok("GetFormById 尚未實作"); // 暫時的回應
        }
    }
}