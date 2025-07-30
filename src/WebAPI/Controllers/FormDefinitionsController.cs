// src/WebAPI/Controllers/FormDefinitionsController.cs
using Core.Entities;
using Core.Enums;
using Core.Interfaces;
using Application.Dtos; // <-- 引用 DTOs
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

        //[HttpPost]
        //public async Task<IActionResult> CreateForm([FromBody] FormDefinition request)
        //{
        //    // 1. 設定對應的實體資料表名稱
        //    request.UserDataTableName = $"UserData_{request.Name}";

        //    // 2. 將表單定義寫入元數據資料庫
        //    await _unitOfWork.FormDefinitions.AddAsync(request);
        //    await _unitOfWork.CompleteAsync();

        //    // 3. 呼叫服務，動態建立實體資料表
        //    try
        //    {
        //        await _tableManager.CreateTableForFormAsync(request);
        //    }
        //    catch (Exception ex)
        //    {
        //        // 如果建表失敗，需要有補償機制 (e.g., 刪除剛才寫入的定義)
        //        // 這裡暫時簡化，只回傳錯誤
        //        return BadRequest($"建立實體資料表失敗: {ex.Message}");
        //    }

        //    return CreatedAtAction(nameof(GetFormById), new { id = request.Id }, request);
        //}

        [HttpPost]
        public async Task<IActionResult> CreateForm([FromBody] CreateFormRequestDto requestDto)
        {
            // 1. 手動從 DTO 映射到 Entity
            var formDefinition = new FormDefinition
            {
                Name = requestDto.Name,
                DisplayName = requestDto.DisplayName,
                Description = requestDto.Description,
                // 2. 在這裡設定對應的實體資料表名稱
                UserDataTableName = $"UserData_{requestDto.Name}",
                Fields = requestDto.Fields.Select(fieldDto => new FieldDefinition
                {
                    Name = fieldDto.Name,
                    Label = fieldDto.Label,
                    FieldType = fieldDto.FieldType,
                    IsRequired = fieldDto.IsRequired,
                    SortOrder = fieldDto.SortOrder,
                    ConfigurationJson = fieldDto.ConfigurationJson
                }).ToList()
            };

            // 3. 將表單定義寫入元數據資料庫
            await _unitOfWork.FormDefinitions.AddAsync(formDefinition);
            await _unitOfWork.CompleteAsync();

            // 4. 呼叫服務，動態建立實體資料表
            try
            {
                await _tableManager.CreateTableForFormAsync(formDefinition);
            }
            catch (Exception ex)
            {
                // 補償機制 (這裡暫時簡化)
                return BadRequest($"建立實體資料表失敗: {ex.Message}");
            }

            // 為了簡化，回傳物件仍用 entity，實務上應該回傳 Response DTO
            return CreatedAtAction(nameof(GetFormById), new { id = formDefinition.Id }, formDefinition);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetFormById(Guid id)
        {
            // 在您的 Repository 中實作 GetByIdWithFieldsAsync 方法
             var form = await _unitOfWork.FormDefinitions.GetByIdWithFieldsAsync(id);
            if (form == null) return NotFound();

            return Ok("GetFormById 尚未實作"); // 暫時的回應
        }
    }
}