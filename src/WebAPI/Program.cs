// src/WebAPI/Program.cs
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// **1. 從 appsettings.json 讀取 JWT 設定**
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["Key"];

// **2. 加入服務到 DI 容器 (Add services to the container)**
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen(); // 我們之後再處理 Swagger

// **3. 設定 JWT 認證服務**
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        // 驗證發行者
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"],

        // 驗證受眾
        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"],

        // 驗證 Token 的有效期間
        ValidateLifetime = true,

        // 驗證簽署金鑰
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey!))
    };
});


var app = builder.Build();

// **4. 設定 HTTP 請求管線 (Configure the HTTP request pipeline)**
if (app.Environment.IsDevelopment())
{
    // app.UseSwagger();
    // app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// **5. 加入認證與授權中介軟體**
// UseAuthentication 必須在 UseAuthorization 之前
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();