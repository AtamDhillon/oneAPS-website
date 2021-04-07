using System.Collections.Generic;
using System.Threading.Tasks;
using Dta.OneAps.Api.Services.Entities;

namespace Dta.OneAps.Api.Services {
    public interface IOpportunityService {
        Task<Opportunity> Create(Opportunity user);
        Task<Opportunity> Update(Opportunity user);
        Task<IEnumerable<Opportunity>> GetAllAsync();
        Task<Opportunity> GetByIdAsync(int id);
    }
}