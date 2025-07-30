// src/WebAPI/Program.cs
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Infrastructure.Persistence; // �ޥ�
using Microsoft.EntityFrameworkCore; // �ޥ�

var builder = WebApplication.CreateBuilder(args);

// **�[�J DbContext �]�w**
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString,
        b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

// **1. �q appsettings.json Ū�� JWT �]�w**
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["Key"];

// **2. �[�J�A�Ȩ� DI �e�� (Add services to the container)**
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen(); // �ڭ̤���A�B�z Swagger

// **3. �]�w JWT �{�ҪA��**
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        // ���ҵo���
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"],

        // ���Ҩ���
        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"],

        // ���� Token �����Ĵ���
        ValidateLifetime = true,

        // ����ñ�p���_
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey!))
    };
});


var app = builder.Build();

// **4. �]�w HTTP �ШD�޽u (Configure the HTTP request pipeline)**
if (app.Environment.IsDevelopment())
{
    // app.UseSwagger();
    // app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// **5. �[�J�{�һP���v�����n��**
// UseAuthentication �����b UseAuthorization ���e
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();